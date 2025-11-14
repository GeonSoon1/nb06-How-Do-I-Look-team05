import { parse } from 'dotenv';
import { prisma } from '../utils/prisma.js';
import { response } from 'express';
import { object } from 'superstruct';

export const getStyles = async (req, res) => {
  const { page = '1', pageSize = '12', sortBy, searchBy, keyword, tag } = req.query;
  // 정렬 필터
  const sortOption = {
    latest: { createdAt: 'desc' },
    mostViewed: { viewCount: 'desc' },
    mostCurated: [{ curations: { _count: 'desc' } }, { viewCount: 'desc' }]
  };
  //검색 필터
  const searchOprion = {
    nickname: { nickname: { contains: keyword } },
    title: { title: { contains: keyword } },
    content: { content: { contains: keyword } },
    tag: { tags: { some: { tag: { contains: keyword } } } }
  };
  //태그로 조회
  if (tag) {
    where = { tags: { some: { tag: tag } } };
  }

  const styles = await prisma.style.findMany({
    where: searchOprion[searchBy] || undefined,
    orderBy: sortOption[sortBy] || sortOption['latest'],
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
    // 표시 정보
    select: {
      id: true,
      images: {
        where: { isThumbnail: true },
        select: { url: true }
      },
      title: true,
      nickname: true,
      tags: { select: { tag: true } },
      items: { select: { itemName: true, brandName: true, price: true, category: true } },
      content: true,
      viewCount: true,
      _count: { select: { curations: true } },
      createdAt: true
    }
  });

  //리스폰스--------
  const data = styles;
  const items = data.map((data) => data.items);
  const getItemCount = () => {
    let count = 0;
    for (let i = 0; i <= items.length - 1; i++) {
      count += items[i].length;
    }
    return count;
  };

  const reprocessing = () => {
    const list = [];
    let thing = {};

    for (let i = 0; i <= data.length - 1; i++) {
      const category = data[i]['items'].map((data) => ({
        [data.category]: { name: data.itemName, brand: data.brandName, price: data.price }
      }));
      const result = category.reduce((acc, item) => {
        const [key, value] = Object.entries(item)[0]; // 객체의 키-값 한 쌍 꺼내기
        acc[key] = value;
        return acc;
      }, {});
      thing = {
        id: data[i]['id'],
        thumbnail: data[i]['images'][0]['url'],
        title: data[i]['title'],
        nickname: data[i]['nickname'],
        tags: data[i]['tags'].map((data) => data.tag),
        categories: result,
        content: data[i]['content'],
        viewCount: data[i]['viewCount'],
        curationCount: data[i]['_count']['curations'],
        createdAt: data[i]['createdAt']
      };
      list.push(thing);
    }
    return list;
  };

  const response = {
    currentPage: page,
    totalPages: data.length,
    totalItemCount: getItemCount(),
    data: reprocessing()
  };

  res.status(200).send(response);
};

//스타일 상제 조회
export const getStyleDetail = async (req, res) => {
  const { id } = req.params;
  const style = await prisma.style.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      viewCount: true,
      createdAt: true,
      _count: { select: { curations: true } },
      items: { select: { itemName: true, brandName: true, price: true, category: true } },
      tags: { select: { tag: true } },
      images: { select: { url: true } }
    }
  });
  //리스폰스------------------
  const data = style;

  const categories = data['items'].map((item) => ({
    [item.category]: { name: item.itemName, brand: item.brandName, price: item.price }
  }));
  const spread = categories.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0]; // 객체의 키-값 한 쌍 꺼내기
    acc[key] = value;
    return acc;
  }, {});

  const response = {
    id: data['id'],
    nickname: data['nickname'],
    title: data['title'],
    content: data['content'],
    viewCount: data['viewCount'],
    curationCount: data['_count']['curations'],
    createdAt: data['createdAt'],
    categories: spread,
    tag: data['tags'].map((tags) => tags.tag),
    imageUrls: data['images'].map((images) => images.url)
  };

  res.status(200).send(response);
};
