import { prisma } from '../utils/prisma.js';

// 등록
export const createComment = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);
  const { content } = req.body;
  // 건순: curation테이블에서 curationId가 일치하는 row의 styleId를 가지고 와볼까  -> 민혁 : nc idea

  const comment = await prisma.$transaction(async (tx) => {
    const curation = await tx.curation.findUniqueOrThrow({
      where: { id: curationId }
    });
    const styleId = curation['styleId'];
    const style = await tx.style.findUniqueOrThrow({
      where: { id: styleId }
    });
    const stylePassword = style['password'];

    const comment = await tx.curationComment.create({
      data: {
        content,
        password: stylePassword,
        curation: {
          connect: { id: curationId }
        },
        style: {
          connect: { id: styleId }
        }
      },
      select: {
        id: true,
        style: { select: { nickname: true } },
        content: true,
        createdAt: true
      }
    });
    return comment;
  });

  const response = {
    id: comment['id'],
    nickname: comment['style']['nickname'],
    content: comment['content'],
    createdAt: comment['createdAt']
  };
  res.status(200).send(response);
};

// 업데이트
export const patchComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const { content } = req.body;

  const comment = await prisma.curationComment.update({
    where: { id: commentId },
    data: {
      content
    },
    select: {
      id: true,
      style: { select: { nickname: true } },
      content: true,
      createdAt: true
    }
  });
  const response = {
    id: comment['id'],
    nickname: comment['style']['nickname'],
    content: comment['content'],
    createdAt: comment['createdAt']
  };
  res.status(200).send(response);
};

// 삭제
export const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const comment = await prisma.curationComment.delete({
      where: { id: commentId }
    });
    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
};
