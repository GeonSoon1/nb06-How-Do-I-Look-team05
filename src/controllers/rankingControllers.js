import { prisma } from '../utils/prisma.js';

export const getRanking = async (req, res) => {
  const { page = '1', pageSize = '12', rankBy } = req.query;
  const rankByOption = {
    total: [{ totalAverage: 'desc' }, { viewCount: 'desc' }],
    trendy: [{ trendyAverage: 'desc' }, { viewCount: 'desc' }],
    personality: [{ uniqueAverage: 'desc' }, { viewCount: 'desc' }],
    practicality: [{ practicalAverage: 'desc' }, { viewCount: 'desc' }],
    costEffectiveness: [{ costEffectiveAverage: 'desc' }, { viewCount: 'desc' }]
  };

  const ranking = await prisma.style.findMany({
    orderBy: rankByOption[rankBy] || rankByOption['total'],
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      totalAverage: true,
      trendyAverage: true,
      uniqueAverage: true,
      practicalAverage: true,
      costEffectiveAverage: true,
      createdAt: true,
      viewCount: true,
      curationCount: true,
      tags: { select: { tag: true } },
      images: { where: { isThumbnail: true }, select: { url: true } },
      items: { select: { itemName: true, brandName: true, price: true, category: true } }
    }
  });
  //리스폰스--------

  const getItemCount = () => {
    const items = ranking.map((data) => data.items);
    let count = 0;
    for (let i = 0; i <= items.length - 1; i++) {
      count += items[i].length;
    }
    return count;
  };
  const reprocessing = () => {
    const rankingList = [];
    let thing = {};

    for (let i = 0; i <= ranking.length - 1; i++) {
      const ratingOption = {
        total: ranking[i]['totalAverage'],
        trendy: ranking[i]['trendyAverage'],
        personality: ranking[i]['uniqueAverage'],
        practicality: ranking[i]['practicalAverage'],
        costEffectiveness: ranking[i]['costEffectiveAverage']
      };
      const category = ranking[i]['items'].map((data) => ({
        [data.category]: { name: data.itemName, brand: data.brandName, price: data.price }
      }));
      const spread = category.reduce((acc, item) => {
        const [key, value] = Object.entries(item)[0]; // 객체의 키-값 한 쌍 꺼내기
        acc[key] = value;
        return acc;
      }, {});
      thing = {
        id: ranking[i]['id'],
        thumbnail: ranking[i]['images'][0]['url'],
        nickname: ranking[i]['nickname'],
        title: ranking[i]['title'],
        tags: ranking[i]['tags'].map((tags) => tags.tag),
        categories: spread,
        viewCount: ranking[i]['viewCount'],
        curationCount: ranking[i]['curationCount'],
        createdAt: ranking[i]['createdAt'],
        ranking: page === '1' ? 1 + i : (parseInt(page) - 1) * ranking.length + 1 + i,
        rating: ratingOption[rankBy] || ratingOption['total']
      };

      rankingList.push(thing);
    }
    return rankingList;
  };

  const response = {
    currentPage: page,
    totalPages: ranking.length,
    totalItemCount: getItemCount(),
    data: reprocessing()
  };
  res.status(200).send(response);
};
