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
