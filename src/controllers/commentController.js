import { prisma } from '../utils/prisma.js';

export const createComment = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);
  const commentData = req.body;
  const comment = await prisma.curationComment.create({
    data: {
      ...commentData,
      curation: {
        connect: { id: curationId }
      }
    },
    select: {
      id: true,
      content: true,
      createdAt: true
    }
  });

  res.status(200).send(comment);
};

export const patchComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const { content, password } = req.body;
  //비밀번호 검증
  const existing = await prisma.curationComment.findUniqueOrThrow({
    where: { id: commentId }
  });
  if (!existing) {
    res.status(404).send({ message: '존재하지 않습니다' });
  }

  if (password !== existing.password) {
    res.status(403).send({ message: '비밀번호가 틀렸습니다' });
  }
  //업데이트
  const comment = await prisma.curationComment.update({
    where: { id: commentId },
    data: {
      content
    },
    select: {
      id: true,
      content: true,
      createdAt: true
    }
  });
  res.status(200).send(comment);
};
