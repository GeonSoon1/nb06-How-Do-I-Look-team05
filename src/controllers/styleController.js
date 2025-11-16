import { prisma } from '../utils/prisma.js';

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

export const patchStyle = async (req, res) => {
  const processedData = req.body;
};
