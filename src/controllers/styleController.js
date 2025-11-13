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
    const { nickname, title, content, password, tags, items } = req.body;

    const originalStyle = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!originalStyle) {
      return res.status(404).json({ message: 'Style not found' });
    }

    if (originalStyle.password !== password) {
      return res.status(403).json({ message: 'Incorrect password' });
    }

    const newImages = req.files
      ? req.files.map((file) => ({
          url: file.path,
          isThumbnail: false
        }))
      : [];

    const updatedStyle = await prisma.$transaction(async (tx) => {
      const styleUpdateData = {};
      if (nickname) styleUpdateData.nickname = nickname;
      if (title) styleUpdateData.title = title;
      if (content !== undefined) styleUpdateData.content = content;

      await tx.style.update({
        where: { id: styleId },
        data: styleUpdateData
      });

      if (tags) {
        const tagOperations = tags.map((tag) =>
          tx.tag.upsert({
            where: { tag },
            update: {},
            create: { tag }
          })
        );
        const upsertTags = await Promise.all(tagOperations);

        await tx.style.update({
          where: { id: styleId },
          data: {
            tags: {
              set: upsertTags.map((t) => ({ id: t.id }))
            }
          }
        });
      }

      if (items) {
        await tx.item.deleteMany({
          where: { styleId }
        });
        await tx.image.createMany({
          data: newImages.map((img) => ({
            ...img,
            styleId
          }))
        });
        const firstImage = await tx.image.findFirst({
          where: { styleId }
        });
        if (firstImage) {
          await tx.image.update({
            where: { id: firstImage.id },
            data: { isThumbnail: true }
          });
        }
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
    const delStyle = await prisma.style.delete({
      where: { id: styleId }
    });
    console.log('삭제완료');
    res.status(200).send(delStyle);
  } catch (err) {
    next(err);
  }
};
