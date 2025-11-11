import { parse } from 'dotenv';
import { prisma } from '../utils/prisma.js';
import { response } from 'express';
import { object } from 'superstruct';

export const getStyles = async (req, res) => {
  const { page = '1', pageSize = 12, sortBy, searchBy, keyword, tag } = req.query;

  let orderBy; // 정렬 필터
  switch (sortBy) {
    case 'latest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'mostViewed':
      orderBy = { viewCount: 'desc' };
      break;
    case 'mostCurated':
      orderBy = { curations: { _count: 'desc' } };
      break;
    default: //기본값
      orderBy = { createdAt: 'desc' };
      break;
  }

  let id; //커서 기능 필터
  const firstStyle = await prisma.style.findFirst({
    orderBy,
  });
  function firstStyleId(style) {
    return (id = style.id);
  }
  let skip;
  if (page === '1') {
    skip = 0;
  } else {
    skip = 1;
  }

  let where; // 검색 조건 필터
  if (searchBy === 'nickname') {
    where = { nickName: { contains: keyword } };
  } else if (searchBy === 'title') {
    where = { title: { contains: keyword } };
  } else if (searchBy === 'content') {
    where = { description: { contains: keyword } };
  } else if (searchBy === 'tag') {
    where = { tags: { some: { tag: { contains: keyword } } } };
  } else {
    where = { id: undefined };
  }
  const stylesOfTag = tag ? { tags: { tag: tag } } : undefined;
  const styles = await prisma.style.findMany({
    //검색옵션
    where: { ...where, ...stylesOfTag },
    // 정렬 옵션
    orderBy,
    //페이지네이션 옵션
    cursor: {
      id: firstStyleId(firstStyle),
    },
    skip,
    take: parseInt(pageSize),
    // 표시 정보
    select: {
      id: true,
      images: {
        where: { isThumbnail: true },
        select: { url: true },
      },
      title: true,
      nickName: true,
      tags: { select: { tag: true } },
      items: { select: { itemName: true, brandName: true, price: true, category: true } },
      description: true,
      viewCount: true,
      _count: { select: { curations: true } },
      createdAt: true,
    },
  });

  //리스폰스----------------------------------------------------------------------
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
        [data.category]: { name: data.itemName, brand: data.brandName, price: data.price },
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
        nickname: data[i]['nickName'],
        tags: data[i]['tags'].map((data) => data.tag),
        categories: result,
        content: data[i]['description'],
        viewCount: data[i]['viewCount'],
        curationCount: data[i]['_count']['curations'],
        createdAt: data[i]['createdAt'],
      };
      list.push(thing);
    }
    return list;
  };

  const response = {
    currentPage: page,
    totalPages: data.length,
    totalItemCount: getItemCount(),
    data: reprocessing(),
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
      nickName: true,
      title: true,
      description: true,
      viewCount: true,
      createdAt: true,
      _count: { select: { curations: true } },
      items: { select: { itemName: true, brandName: true, price: true, category: true } },
      tags: { select: { tag: true } },
      images: { select: { url: true } },
    },
  });
  //리스폰스------------------
  const data = style;

  const categories = data['items'].map((item) => ({
    [item.category]: { name: item.itemName, brand: item.brandName, price: item.price },
  }));
  const spread = categories.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0]; // 객체의 키-값 한 쌍 꺼내기
    acc[key] = value;
    return acc;
  }, {});

  const response = {
    id: data['id'],
    nickName: data['nickName'],
    title: data['title'],
    content: data['description'],
    viewCount: data['viewCount'],
    curationCount: data['_count']['curations'],
    createdAt: data['createdAt'],
    categories: spread,
    tag: data['tags'].map((tags) => tags.tag),
    imageUrls: data['images'].map((images) => images.url),
  };

  res.status(200).send(response);
};
