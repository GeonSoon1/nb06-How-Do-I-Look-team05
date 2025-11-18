import { prisma } from '../utils/prisma.js';

// style 등록
export const createStyle = async (req, res) => {
  // validator 미들웨어에서 처리 및 검증된 데이터는 req.body에 담겨 넘어옵니다.
  const processedData = req.body;

  const newStyle = await prisma.style.create({
    data: {
      ...processedData,
      tags: {
        connectOrCreate: processedData.tags.map((tag) => ({
          where: { tag },
          create: { tag }
        }))
      },
      images: {
        create: processedData.images
      },
      items: {
        create: processedData.items
      }
    },
    include: {
      tags: true,
      images: true,
      items: true
    }
  });
  res.status(201).json(newStyle);
};

// style 수정
export const patchStyle = async (req, res, next) => {
  try {
    const styleId = Number(req.params.styleId);
    const { nickname, title, content, tags, items, images } = req.body;

    const updatedStyle = await prisma.$transaction(async (tx) => {
      await tx.style.update({
        where: { id: styleId },
        data: {
          nickname,
          title,
          content
        }
      });

      if (req.files && req.files.length > 0) {
        await tx.image.deleteMany({ where: { styleId } });
        await tx.image.createMany({
          data: images.map((img) => ({ ...img, styleId }))
        });
      }

      if (items) {
        await tx.item.deleteMany({ where: { styleId } });
        await tx.item.createMany({
          data: items.map((item) => ({ ...item, styleId }))
        });
      }

      if (tags) {
        const tagUpsert = await Promise.all(
          tags.map((tag) =>
            tx.tag.upsert({
              where: { tag },
              update: {},
              create: { tag }
            })
          )
        );

        await tx.style.update({
          where: { id: styleId },
          data: {
            tags: {
              set: tagUpsert.map((t) => ({ id: t.id }))
            }
          }
        });
      }

      return tx.style.findUnique({
        where: { id: styleId },
        include: {
          images: true,
          tags: true,
          items: true
        }
      });
    });
    res.status(200).json(updatedStyle);
  } catch (err) {
    next(err);
  }
};

// 삭제
export const deleteStyle = async (req, res, next) => {
  try {
    const styleId = Number(req.params.styleId);
    const deletedStyle = await prisma.style.delete({
      where: { id: styleId }
    });
    res.status(200).send(deletedStyle);
  } catch (err) {
    next(err);
  }
};
//스타일 목록 조회===
export const getStyles = async (req, res, next) => {
  try {
    const { page = '1', pageSize = '12', sortBy, searchBy, keyword, tag } = req.query;
    // 정렬 필터
    const sortOption = {
      latest: { createdAt: 'desc' },
      mostViewed: { viewCount: 'desc' },
      mostCurated: [{ curations: { _count: 'desc' } }, { viewCount: 'desc' }]
    };
    //검색 필터
    const searchOption = {
      nickname: { nickname: { contains: keyword } },
      title: { title: { contains: keyword } },
      content: { content: { contains: keyword } },
      tag: { tags: { some: { tag: { contains: keyword } } } }
    };
    //태그로 조회
    let where;
    if (tag) {
      where = { tags: { some: { tag: tag } } };
    } else {
      where = searchOption[searchBy] || undefined;
    }

    const styles = await prisma.$transaction(async (tx) => {
      if (tag) {
        await tx.tag.updateMany({
          where: { tag: tag },
          data: {
            clickCount: { increment: 1 }
          }
        });
      }

      const foundStyles = await tx.style.findMany({
        where,
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
      return foundStyles;
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
  } catch (e) {
    next(e);
  }
};

//스타일 상제 조회===
export const getStyleDetail = async (req, res, next) => {
  try {
    const styleId = parseInt(req.params.styleId, 10);

    const style = await prisma.$transaction(async (tx) => {
      const detail = await tx.style.findUniqueOrThrow({
        where: { id: styleId },
        select: {
          id: true,
          nickname: true,
          title: true,
          content: true,
          viewCount: true,
          createdAt: true,
          curationCount: true,
          items: { select: { itemName: true, brandName: true, price: true, category: true } },
          tags: { select: { tag: true } },
          images: { select: { url: true } }
        }
      });
      await tx.style.update({
        where: { id: detail.id },
        data: { viewCount: { increment: 1 } }
      });
      return detail;
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
      curationCount: data['curationCount'],
      createdAt: data['createdAt'],
      categories: spread,
      tag: data['tags'].map((tags) => tags.tag),
      imageUrls: data['images'].map((images) => images.url)
    };

    res.status(200).send(response);
  } catch (e) {
    next(e);
  }
};
