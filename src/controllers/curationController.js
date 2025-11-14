import { prisma } from '../utils/prisma.js';
import { CreateCuration, PatchCuration, DeleteCuration } from '../structs/curationStructs.js';
import { assert } from 'superstruct';

// 큐레이팅 등록 http://localhost:3000/styles/{styleId}/curations
export const createStyleCuration = async (req, res, next) => {
  try {
    // 글 내용(body) 검증
    assert(req.body, CreateCuration);

    // 어떤 스타일에 속한 큐레이팅인지
    const styleId = parseInt(req.params.styleId, 10);
    const curationData = req.body;

    // 스타일ㄹ이 실제로 존재하는지 확인
    const existingStyle = await prisma.style.findUniqueOrThrow({
      where: { id: styleId }
    });

    if (!existingStyle) {
      return res.status(404).json({ message: '해당 스타일을 찾을 수 없습니다.' });
    }

    // 업로드 된 이미지 파일 정보
    const file = req.file;
    let imageUrl = null;

    if (file) {
      imageUrl = `/uploads/${file.filename}`;
    }

    // DB에 큐레이팅 생성 (텍스트 + 이미지 경로 같이)
    const curation = await prisma.curation.create({
      data: {
        ...curationData, // nickname, content, 점수들 등
        styleId,
        imageUrl // prisma 모델에 imageUrl 필드가 있어야 함
      },
      select: {
        id: true,
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,
        imageUrl: true
      }
    });

    // 클라이언트에게 응답
    res.status(201).json(curation);
  } catch (err) {
    next(err);
  }
};
// 5~57번줄까지 대용 코드 작성

// 61~153(마지막줄까지) 건순님?이 작성하신거같습니다 61번부터 87번까지는 저(대용)랑 코드가 겹치는데 수정하면 오류 날 것 같아 혹시 몰라 남겨둡니다!
// // styleId에 해당하는 style이 있는지 확인
// const existingStyle = await prisma.style.findUniqueOrThrow({
//   where: { id: styleId }
// })
// if (!existingStyle) {
//   throw new Error("NotFoundError")
// }

//   // styleId로 FK 연결되어있는 스타일의 큐레이션 생성
//   const curation = await prisma.curation.create({
//     data: {
//       ...curationData,
//       styleId
//     },
//     select: {
//       id: true,
//       nickname: true,
//       content: true,
//       trendy: true,
//       personality: true,
//       practicality: true,
//       costEffectiveness: true,
//       createdAt: true
//     }
//   })
//   res.status(200).send(curation)
// }

// 큐레이팅 조회 http://localhost:3000/styles/{styleId}/curations

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
