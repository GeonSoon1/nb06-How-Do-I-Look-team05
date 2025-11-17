import { prisma } from '../utils/prisma.js';


// 큐레이팅 등록 http://localhost:3000/styles/{styleId}/curations
export const createStyleCuration = async (req, res) => {
  const styleId = parseInt(req.params.styleId, 10);
  const curationData = req.body;

  // styleId로 FK 연결되어있는 스타일의 큐레이션 생성
  const curation = await prisma.curation.create({
    data: {
      ...curationData,
      style: {
        connect: {id: styleId}
      }
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



// 큐레이팅 목록 조회 GET /styles/:styleId/curations
export const getStyleCuration = async (req, res) => {
  const styleId = parseInt(req.params.styleId, 10);
  const { page = 1, pageSize = 10, searchBy, keyword } = req.query;

  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);

  // 1) 기본 형식 검증 (잘못된 요청이면 400)
  if (Number.isNaN(styleId) || Number.isNaN(pageNum) || Number.isNaN(pageSizeNum)) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  if (pageNum <= 0 || pageSizeNum <= 0) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  // searchBy가 들어왔다면 nickname 또는 content만 허용하고 싶다면:
  if (searchBy && searchBy !== 'nickname' && searchBy !== 'content') {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  // 2) 검색 조건 만들기
  let searchCondition = {};

  if (keyword) {
    if (searchBy === 'nickname') {
      searchCondition = {
        nickname: { contains: keyword, mode: 'insensitive' }
      };
    } else if (searchBy === 'content') {
      searchCondition = {
        content: { contains: keyword, mode: 'insensitive' }
      };
    } else {
      // searchBy 없으면 둘 다
      searchCondition = {
        OR: [
          { nickname: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } }
        ]
      };
    }
  }

  const where = {
    styleId,
    ...searchCondition
  };

  try {
    const totalItemCount = await prisma.curation.count({ where });

    const curations = await prisma.curation.findMany({
      where,
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,
        style: {
          select: {
            nickname: true
          }
        },
        curationComment: {
          select: {
            id: true,
            content: true,
            createdAt: true
          }
        }
      }
    });

    const data = curations.map((c) => ({
      id: c.id,
      nickname: c.nickname,
      content: c.content,
      trendy: c.trendy,
      personality: c.personality,
      practicality: c.practicality,
      costEffectiveness: c.costEffectiveness,
      createdAt: c.createdAt,
      comment: c.curationComment
        ? {
            id: c.curationComment.id,
            nickname: c.style.nickname,
            content: c.curationComment.content,
            createdAt: c.curationComment.createdAt
          }
        : {}
    }));

    return res.status(200).json({
      currentPage: pageNum,
      totalPages: Math.ceil(totalItemCount / pageSizeNum),
      totalItemCount,
      data
    });
  } catch (err) {
    console.error(err);
    // 여기까지 왔으면 진짜 서버 쪽 문제라 500
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



// 큐레이팅 수정 http://localhost:3000/curations/{curationId}
export const updateCuration = async (req, res) => {
  //structError 400 Bad Request 처리 핸들러 필요.
  const curationId = parseInt(req.params.curationId, 10);
  const { password, ...rest } = req.body;

  // 큐레이팅 수정
  const updated_curation = await prisma.curation.update({
    where: { id: curationId },
    data: rest,
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
  const curationId = parseInt(req.params.curationId, 10);
  
  // 큐레이팅 삭제
  try {
    await prisma.curation.delete({
      where: { id: curationId }
    });
    res.status(200).send({ message: '큐레이팅 삭제 성공' });
  } catch (err) {
    res.status(404).send({ message: '큐레이팅이 존재하지 않습니다.' });
  }
};
