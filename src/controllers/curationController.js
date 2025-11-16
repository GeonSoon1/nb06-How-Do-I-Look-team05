import { prisma } from '../utils/prisma.js';
import { CreateCuration, PatchCuration, DeleteCuration } from '../structs/curationStructs.js';
import { assert } from 'superstruct';
import { parse } from 'dotenv';

// 큐레이팅 등록 http://localhost:3000/styles/{styleId}/curations
export const createStyleCuration = async (req, res) => {
  assert(req.body, CreateCuration);
  const styleId = parseInt(req.params.styleId, 10);
  const curationData = req.body;

  // styleId에 해당하는 style이 있는지 확인
  const existingStyle = await prisma.style.findUniqueOrThrow({
    where: { id: styleId }
  });
  if (!existingStyle) {
    throw new Error('NotFoundError');
  }

  // styleId로 FK 연결되어있는 스타일의 큐레이션 생성
  const curation = await prisma.curation.create({
    data: {
      ...curationData,
      styleId
    },
    select: {
      id: true,
      nickname: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true
    }
  });
  res.status(200).send(curation);
};

// 큐레이팅 목록 조회 http://localhost:3000/styles/{styleId}/curations
export const getStyleCuration = async (req, res) => {
  const styleId = parseInt(req.params.styleId, 10);
  const { page = 1, pageSize = 10, keyword } = req.query;

  const where = keyword
    ? {
        OR: [
          { nickname: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } }
        ]
      }
    : undefined;

  const styleCurations = await prisma.style.findUniqueOrThrow({
    where: { id: styleId },
    include: {
      curations: {
        where,
        skip: parseInt(page),
        take: parseInt(pageSize),
        select: {
          id: true,
          nickname: true,
          content: true,
          trendy: true,
          personality: true,
          practicality: true,
          costEffectiveness: true,
          createdAt: true
        }
      }
    }
  });
  res.status(200).send(styleCurations);
};

// 큐레이팅 수정 http://localhost:3000/curations/{curationId}
export const updateCuration = async (req, res) => {
  //structError 400 Bad Request 처리 핸들러 필요.
  assert(req.body, PatchCuration);
  const curationId = parseInt(req.params.curationId, 10);
  const data = req.body;

  // 존재 여부
  const existing = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId }
  });
  if (!existing) {
    throw new Error('존재하지 않습니다.');
  }

  // 비밀번호 검증
  if (existing.password !== data.password) {
    res.status(403).send({ message: '비밀번호가 틀렸습니다' });
  }

  // 큐레이팅 수정
  const updated_curation = await prisma.curation.update({
    where: { id: curationId },
    data,
    select: {
      id: true,
      nickname: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true
    }
  });
  res.status(200).send(updated_curation);
};

// 큐레이팅 삭제 http://localhost:3000/curations/{curationId}
export const deleteCuration = async (req, res) => {
  assert(req.body, DeleteCuration);
  const curationId = parseInt(req.params.curationId, 10);
  const data = req.body;

  // 존재 여부 확인
  const existing = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId }
  });
  if (!existing) {
    throw new Error('존재하지 않습니다.');
  }

  // 비밀번호 검증
  if (existing.password !== data.password) {
    res.status(403).send({ message: '비밀번호가 틀렸습니다.' });
  }

  // 큐레이팅 삭제
  await prisma.curation.delete({
    where: { id: curationId }
  });
  res.status(200).send({ message: '큐레이팅 삭제 성공' });
};
