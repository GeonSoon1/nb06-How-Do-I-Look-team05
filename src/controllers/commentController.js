import { prisma } from '../utils/prisma.js';

export const createComment = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);
  const { ...commentData } = req.body;
  console.log(curationId);
  const comment = await prisma.curationComment.create({
    data: {
      ...commentData,
      curation: {
        connect: curationId
      }
    }
  });
  res.status(201).send(comment);
};
