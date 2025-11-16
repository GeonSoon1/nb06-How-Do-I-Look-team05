import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.js';

export const hashPassword = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next();
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyPassword = async (req, res, next) => {
  try {
    const { ...param } = req.params;
    const id = Number(Object.values(param)[0]);
    const modelName = Object.keys(param)[0].replace('Id', '');

    console.log('Id:', id);
    console.log('modelName:', modelName);

    const { password } = req.body;
    console.log({ password });

    if (!password) {
      return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }

    let item;
    if (modelName === 'style') {
      item = await prisma.style.findUnique({
        where: { id }
      });
    } else if (modelName === 'comment') {
      item = await prisma.curationComment.findUnique({
        where: { id }
      });
    }

    if (!item) {
      const message =
        modelName === 'style' ? '게시글이 존재하지 않습니다.' : '댓글이 존재하지 않습니다.';
      return res.status(404).json({ message });
    }

    const isPasswordCorrect = await bcrypt.compare(password, item.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    console.log('비밀번호 확인 완료');

    next();
  } catch (err) {
    next(err);
  }
};
