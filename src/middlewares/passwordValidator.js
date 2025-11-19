import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.js';

export const hashPassword = async (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
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

const modelConfig = {
  style: {
    model: prisma.style,
    notFoundMessage: '존재하지 않습니다.'
  },
  comment: {
    model: prisma.curationComment,
    notFoundMessage: '존재하지 않습니다.'
  },
  curation: {
    model: prisma.curation,
    notFoundMessage: '존재하지 않습니다.'
  }
};

export const verifyPassword = async (req, res, next) => {
  try {
    const paramKey = Object.keys(req.params)[0];
    const id = Number(req.params[paramKey]);
    const modelName = paramKey.replace('Id', '');
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    const config = modelConfig[modelName];
    if (!config) {
      return res.status(400).json({ message: '잘못된 경로의 요청입니다.' });
    }

    const modelId = await config.model.findUnique({ where: { id } });


    if (!modelId || !modelId.password) {
      return res.status(404).json({ message: config.notFoundMessage });
    }

    const isPasswordCorrect = await bcrypt.compare(password, modelId.password);
    
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const verifyStylePassword = async (req, res, next) => {
  try {
    const curationId = parseInt(req.params.curationId, 10);
    const { password } = req.body;
    const isStylePassword = await prisma.$transaction(async (tx) => {
      const curation = await tx.curation.findUnique({ where: { id: curationId } });
      const style = await tx.style.findUnique({ where: { id: curation['styleId'] } });
      const stylePassword = style['password'];
      return stylePassword;
    });

    if (!password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const isStylePasswordCorrect = await bcrypt.compare(password, isStylePassword);

    if (!isStylePasswordCorrect) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    next();
  } catch (e) {
    next(e);
  }
};
