import multer from 'multer';

export function errorHandler(err, _req, res, _next) {
  // 🔹 Multer에서 터진 에러인지 확인
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

  // 나머지 일반 에러들
  const status = err.status || 500;

  return res.status(status).json({
    ok: false,
    message: err.message || 'Internal Server Error'
  });
}
