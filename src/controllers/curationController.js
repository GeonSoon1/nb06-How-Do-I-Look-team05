import { prisma } from '../utils/prisma.js';

////////// 큐레이팅 등록 http://localhost:3000/styles/{styleId}/curations //////////
export const createStyleCuration = async (req, res) => {
  const styleId = parseInt(req.params.styleId, 10);
  const curationData = req.body;

  const curation = await prisma.$transaction(async (tx) => {
    // 1) 큐레이션 생성
    const created = await tx.curation.create({
      data: {
        ...curationData,
        style: {
          connect: { id: styleId }
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

    // 2) 해당 style의 trendyAverage, uniqueAverage, practicalAverage, costEffectiveAverage 값을 가지고 온다.
    const averages = await tx.style.findMany({
      where: { id: styleId },
      select: {
        trendyAverage: true,
        uniqueAverage: true,
        practicalAverage: true,
        costEffectiveAverage: true,
        curationCount: true
      }
    });

    // 3) 각 점수를 style모델에서 update 해줘야한다.
    // {(평균점수 * count수) + 새로운 값} / count+1)
    const average = averages[0];
    const updated_score = await tx.style.update({
      where: { id: styleId },
      data: {
        curationCount: {
          increment: 1
        },
        trendyAverage:
          (Number(average['trendyAverage']) * Number(average['curationCount']) +
            Number(created['trendy'])) /
          Number(average['curationCount'] + 1),
        uniqueAverage:
          (Number(average['uniqueAverage']) * Number(average['curationCount']) +
            Number(created['personality'])) /
          Number(average['curationCount'] + 1),
        practicalAverage:
          (Number(average['practicalAverage']) * Number(average['curationCount']) +
            Number(created['practicality'])) /
          Number(average['curationCount'] + 1),
        costEffectiveAverage:
          (Number(average['costEffectiveAverage']) * Number(average['curationCount']) +
            Number(created['costEffectiveness'])) /
          Number(average['curationCount'] + 1)
      }
    });
    // console.log(updated_score)

    //4) style모델의 totalAverage도 update 해줘야한다.
    const final_data = await tx.style.update({
      where: { id: styleId },
      data: {
        totalAverage:
          (Number(updated_score['trendyAverage']) +
            Number(updated_score['uniqueAverage']) +
            Number(updated_score['practicalAverage']) +
            Number(updated_score['costEffectiveAverage'])) /
          4
      }
    });

    return created;
  });
  res.status(200).send(curation);
};

////////// 큐레이팅 목록 조회 GET /styles/:styleId/curations //////////
export const getStyleCuration = async (req, res) => {
  const styleId = parseInt(req.params.styleId, 10);
  const { page = 1, pageSize = 10, searchBy, keyword } = req.query;

  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);

  // 1) 기본 형식 검증 (잘못된 요청이면 400)
  if (
    Number.isNaN(styleId) ||
    Number.isNaN(pageNum) ||
    Number.isNaN(pageSizeNum) ||
    pageNum <= 0 ||
    pageSizeNum <= 0
  ) {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
  }

  // searchBy가 들어왔다면 nickname 또는 content만 허용
  if (searchBy && searchBy !== 'nickname' && searchBy !== 'content') {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
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

  // 여기부터는 try/catch 필요 없음. 에러 나면 asyncHandler → errorHandler로 감.
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
};

////////// 큐레이팅 수정 http://localhost:3000/curations/{curationId} //////////
// 수정 -> 원래 curationId의 점수를 평균에서 빼고 새로운 점수로 다시 평균 내기
export const updateCuration = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);
  const { password, ...rest } = req.body; // 비밀번호 검증은 verifyPassword에서 이미 처리 완료

  // curationId 형식 오류 → 400
  if (Number.isNaN(curationId) || curationId <= 0) {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
  }

  const updated_curation = await prisma.$transaction(async (tx) => {
    // 1) 기존 큐레이션 조회
    const existing = await tx.curation.findUnique({
      where: { id: curationId },
      select: {
        id: true,
        styleId: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true
      }
    });

    // 없는 큐레이션 → 404
    if (!existing) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

    const styleId = existing.styleId;

    // 2) 큐레이션 내용/점수 수정
    const newCuration = await tx.curation.update({
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

    // 3) style의 현재 평균값 + curationCount 가져오기
    const style = await tx.style.findUnique({
      where: { id: styleId },
      select: {
        trendyAverage: true,
        uniqueAverage: true,
        practicalAverage: true,
        costEffectiveAverage: true,
        curationCount: true
      }
    });

    // 없는 style → 404
    if (!style) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

    const count = Number(style.curationCount);

    if (count <= 0) {
      const error = new Error('잘못된 요청입니다');
      error.status = 400;
      throw error;
    }

    // 4) 평균 재계산
    const newTrendyAvg =
      (Number(style.trendyAverage) * count - existing.trendy + newCuration.trendy) / count;

    const newUniqueAvg =
      (Number(style.uniqueAverage) * count - existing.personality + newCuration.personality) /
      count;

    const newPracticalAvg =
      (Number(style.practicalAverage) * count - existing.practicality + newCuration.practicality) /
      count;

    const newCostAvg =
      (Number(style.costEffectiveAverage) * count -
        existing.costEffectiveness +
        newCuration.costEffectiveness) /
      count;

    const totalAverageValue = (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / 4; // <- 이부분 '4'로 수정필요

    await tx.style.update({
      where: { id: styleId },
      data: {
        trendyAverage: newTrendyAvg,
        uniqueAverage: newUniqueAvg,
        practicalAverage: newPracticalAvg,
        costEffectiveAverage: newCostAvg,
        totalAverage: totalAverageValue
      }
    });

    return newCuration;
  });

  res.status(200).send(updated_curation);
};

// 큐레이팅 삭제 http://localhost:3000/curations/{curationId}
// 삭제 -> 해당 curationId의 점수를 평균에서 빼고, 다시 평균 구하기
export const deleteCuration = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);

  // id 형식이 이상하면 여기서 400
  if (Number.isNaN(curationId) || curationId <= 0) {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    // 1) 삭제할 큐레이팅 조회
    const existing = await tx.curation.findUnique({
      where: { id: curationId },
      select: {
        id: true,
        styleId: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true
      }
    });

    if (!existing) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

    const styleId = existing.styleId;

    // 2) style 정보 조회
    const style = await tx.style.findUnique({
      where: { id: styleId },
      select: {
        trendyAverage: true,
        uniqueAverage: true,
        practicalAverage: true,
        costEffectiveAverage: true,
        curationCount: true
      }
    });

    if (!style) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

    const count = Number(style.curationCount);
    const newCount = count - 1;

    if (newCount < 0) {
      const error = new Error('잘못된 요청입니다');
      error.status = 400;
      throw error;
    }

    let newTrendyAvg = 0;
    let newUniqueAvg = 0;
    let newPracticalAvg = 0;
    let newCostAvg = 0;
    let newTotalAvg = 0;

    if (newCount > 0) {
      newTrendyAvg = (Number(style.trendyAverage) * count - existing.trendy) / newCount;

      newUniqueAvg = (Number(style.uniqueAverage) * count - existing.personality) / newCount;

      newPracticalAvg = (Number(style.practicalAverage) * count - existing.practicality) / newCount;

      newCostAvg =
        (Number(style.costEffectiveAverage) * count - existing.costEffectiveness) / newCount;

      newTotalAvg = (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / 4; // <- 이 부분도 '4'로 수정 필요
    }

    await tx.curation.delete({
      where: { id: curationId }
    });

    await tx.style.update({
      where: { id: styleId },
      data: {
        curationCount: newCount,
        trendyAverage: newTrendyAvg,
        uniqueAverage: newUniqueAvg,
        practicalAverage: newPracticalAvg,
        costEffectiveAverage: newCostAvg,
        totalAverage: newTotalAvg
      }
    });
  });

  return res.status(200).send({ message: '큐레이팅 삭제 성공' });
};
