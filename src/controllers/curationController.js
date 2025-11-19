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
    })
    // console.log(final_data)
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

<<<<<<< HEAD
  // curationId 형식 오류 → 400
  if (Number.isNaN(curationId) || curationId <= 0) {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
  }
=======
  try {
    const updated_curation = await prisma.$transaction(async (tx) => {
      // 1) 기존 큐레이션 + styleId + 예전 점수들 가져오기
      const existing = await tx.curation.findUnique({
        where: { id: curationId },
        select: {
          id: true,
          styleId: true,
          trendy: true,
          personality: true, // uniqueAverage에 해당
          practicality: true,
          costEffectiveness: true
        }
      });
>>>>>>> 632a4a3 (README.md 파일 추가)

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
<<<<<<< HEAD
=======

      const styleId = existing.styleId;

      // 2) 큐레이션 점수/내용 수정
      const newCuration = await tx.curation.update({
        where: { id: curationId },
        data: rest, // nickname, content, trendy, personality, practicality, costEffectiveness 등
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

      if (!style) {
        throw new Error('NotFoundStyle');
      }

      const count = Number(style.curationCount);
      // count가 0이면 나누기 에러 방지
      if (count <= 0) {
        // 이 경우엔 그냥 평균을 새 점수로 세팅하는 쪽으로 가도 됨
        // 근데 정상 흐름이라면 count >= 1일 거라서, 여기서는 단순히 예외만 던짐
        throw new Error('InvalidCurationCount');
      }

      // 4) 각 평균 재계산: (현재 평균 * 개수 - 옛 점수 + 새 점수) / 개수
      const newTrendyAvg =
        (Number(style.trendyAverage) * count - existing.trendy + newCuration.trendy) / count;

      const newUniqueAvg =
        (Number(style.uniqueAverage) * count - existing.personality + newCuration.personality) /
        count;

      const newPracticalAvg =
        (Number(style.practicalAverage) * count -
          existing.practicality +
          newCuration.practicality) /
        count;

      const newCostAvg =
        (Number(style.costEffectiveAverage) * count -
          existing.costEffectiveness +
          newCuration.costEffectiveness) /
        count;

      // 5) totalAverage 재계산
      // 너가 create에서 쓰던 공식이
      // (trendyAverage + uniqueAverage + practicalAverage + costEffectiveAverage) / curationCount
      // 라서 여기도 그 방식 그대로 맞춰 놓음
      const totalAverageValue =
        (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / count;

      // 6) style 테이블 업데이트
      const updated_style = await tx.style.update({
        where: { id: styleId },
        data: {
          trendyAverage: newTrendyAvg,
          uniqueAverage: newUniqueAvg,
          practicalAverage: newPracticalAvg,
          costEffectiveAverage: newCostAvg,
          totalAverage: totalAverageValue
        }
      });

      // 최종 응답은 수정된 큐레이션으로
      console.log(updated_style);
      return newCuration;
>>>>>>> 632a4a3 (README.md 파일 추가)
    });

    // 없는 큐레이션 → 404
    if (!existing) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

<<<<<<< HEAD
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
      (Number(style.uniqueAverage) * count -
        existing.personality +
        newCuration.personality) /
      count;

    const newPracticalAvg =
      (Number(style.practicalAverage) * count -
        existing.practicality +
        newCuration.practicality) /
      count;

    const newCostAvg =
      (Number(style.costEffectiveAverage) * count -
        existing.costEffectiveness +
        newCuration.costEffectiveness) /
      count;

    const totalAverageValue =
      (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / count;

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


=======
>>>>>>> 632a4a3 (README.md 파일 추가)
// 큐레이팅 삭제 http://localhost:3000/curations/{curationId}
// 삭제 -> 해당 curationId의 점수를 평균에서 빼고, 다시 평균 구하기
export const deleteCuration = async (req, res) => {
  const curationId = parseInt(req.params.curationId, 10);

<<<<<<< HEAD
  // id 형식이 이상하면 여기서 400
  if (Number.isNaN(curationId) || curationId <= 0) {
    const error = new Error('잘못된 요청입니다');
    error.status = 400;
    throw error;
  }
=======
  try {
    await prisma.$transaction(async (tx) => {
      // 1) 삭제할 큐레이팅의 styleId + 기존 점수들 조회
      const existing = await tx.curation.findUnique({
        where: { id: curationId },
        select: {
          id: true,
          styleId: true,
          trendy: true,
          personality: true, // uniqueAverage에 대응
          practicality: true,
          costEffectiveness: true
        }
      });
>>>>>>> 632a4a3 (README.md 파일 추가)

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
<<<<<<< HEAD
=======

      const styleId = existing.styleId;

      // 2) style의 현재 평균값 + curationCount 조회
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
        throw new Error('NOT_FOUND_STYLE');
      }

      const count = Number(style.curationCount);
      const newCount = count - 1;

      if (newCount < 0) {
        throw new Error('INVALID_CURATION_COUNT');
      }

      let newTrendyAvg = 0;
      let newUniqueAvg = 0;
      let newPracticalAvg = 0;
      let newCostAvg = 0;
      let newTotalAvg = 0;

      // 3) 남아 있는 큐레이션이 1개 이상일 때만 다시 평균 계산
      //    (count == 1 이었다면, 삭제 후엔 평균들을 0으로 초기화)
      if (newCount > 0) {
        newTrendyAvg = (Number(style.trendyAverage) * count - existing.trendy) / newCount;

        newUniqueAvg = (Number(style.uniqueAverage) * count - existing.personality) / newCount;

        newPracticalAvg =
          (Number(style.practicalAverage) * count - existing.practicality) / newCount;

        newCostAvg =
          (Number(style.costEffectiveAverage) * count - existing.costEffectiveness) / newCount;

        // create에서 쓰던 공식 따라감:
        // (trendyAverage + uniqueAverage + practicalAverage + costEffectiveAverage) / curationCount
        newTotalAvg = (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / newCount;
      }

      // 4) 큐레이팅 삭제
      await tx.curation.delete({
        where: { id: curationId }
      });

      // 5) style의 평균값 + curationCount 업데이트
      const updated_style = await tx.style.update({
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
      console.log(updated_style);
>>>>>>> 632a4a3 (README.md 파일 추가)
    });

    if (!existing) {
      const error = new Error('존재하지 않습니다');
      error.status = 404;
      throw error;
    }

<<<<<<< HEAD
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
      newTrendyAvg =
        (Number(style.trendyAverage) * count - existing.trendy) / newCount;

      newUniqueAvg =
        (Number(style.uniqueAverage) * count - existing.personality) / newCount;

      newPracticalAvg =
        (Number(style.practicalAverage) * count - existing.practicality) / newCount;

      newCostAvg =
        (Number(style.costEffectiveAverage) * count -
          existing.costEffectiveness) /
        newCount;

      newTotalAvg =
        (newTrendyAvg + newUniqueAvg + newPracticalAvg + newCostAvg) / newCount;
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
=======
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};
>>>>>>> 632a4a3 (README.md 파일 추가)
