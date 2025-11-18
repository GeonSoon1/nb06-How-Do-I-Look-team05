import multer from 'multer';

export function errorHandler(err, _req, res, _next) {
  // 🔹 Multer에서 터진 에러인지 확인
  console.error(err);

  if (err instanceof multer.MulterError) {
    const isFileTooLarge = err.code === 'LIMIT_FILE_SIZE';

    return res.status(isFileTooLarge ? 413 : 400).json({
      ok: false,
      message: isFileTooLarge
        ? '업로드 용량 제한(최대 10MB)을 초과했습니다.'
        : '업로드 처리 중 오류가 발생했습니다.',
      details: err.code
    });
  }

  // fileFilter에서 던진 커스텀 에러
  if (err && err.message === '이미지 파일만 업로드 가능합니다.') {
    return res.status(400).json({
      ok: false,
      message: err.message
    });
  }

  if (err.name === 'StructError') {
    return res.status(400).send({ message: err.message });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).send({ message: '요청한 리소스를 찾을 수 없습니다.' });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(500).send({ message: err.message });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).send({ message: '데이터베이스 처리 중 오류가 발생했습니다.' });
  } else {
    res.status(500).send({ message: err.message });
  }
}
