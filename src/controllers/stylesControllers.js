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
    //페이지 네이션 옵션
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
    const dbId = data.map((data) => data.id);
    const dbImage = data.map((data) => data.images);
    const dbTitle = data.map((data) => data.title);
    const dbNickname = data.map((data) => data.nickName);
    const dbTag = data.map((data) => data.tags);
    const dbItem = data.map((data) => data.items);
    const dbDescription = data.map((data) => data.description);
    const dbViewCount = data.map((data) => data.viewCount);
    const dbCurationCount = data.map((data) => data._count.curations);
    const dbCreatedAt = data.map((data) => data.createdAt);
    const list = [];
    let thing = {};
    for (let i = 0; i <= items.length - 1; i++) {
      const category = dbItem[i].map((data) => ({
        [data.category]: { name: data.itemName, brand: data.brandName, price: data.price },
      }));
      const result = category.reduce((acc, item) => {
        const [key, value] = Object.entries(item)[0]; // 객체의 키-값 한 쌍 꺼내기
        acc[key] = value;
        return acc;
      }, {});

      thing = {
        id: dbId[i],
        thumbnail: dbImage[i][0]['url'],
        title: dbTitle[i],
        nickname: dbNickname[i],
        tags: dbTag[i].map((data) => data.tag),
        categories: result,
        content: dbDescription[i],
        viewCount: dbViewCount[i],
        curationCount: dbCurationCount[i],
        createdAt: dbCreatedAt[i],
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
