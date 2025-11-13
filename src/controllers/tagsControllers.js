import { prisma } from '../utils/prisma.js';

export const getTags = async (req, res) => {
  const tags = await prisma.tag.findMany({
    orderBy: [{ styleCount: 'desc' }, { clickCount: 'desc' }],
    take: 10,
    select: { tag: true },
  });

  const response = {
    tag: tags.map((data) => data.tag),
  };
  res.status(200).send(response);
};
