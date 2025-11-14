import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.js';

export const hashPassword = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next();
  }
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyPassword = async (req, res, next) => {
  try {
    const styleId = Number(req.params.styleId);
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }

    const foundStyle = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!foundStyle) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundStyle.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
