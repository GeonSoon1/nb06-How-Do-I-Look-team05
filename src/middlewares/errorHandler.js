const multer = require('multer');

function errorHandler(err, _req, res, _next) {
  // Multer 에러 변환
  if (err instanceof multer.MulterError) {
    const isFileTooLarge = err.code === 'LIMIT_FILE_SIZE';
    return res.status(isFileTooLarge ? 413 : 400).json({
      ok: false,
      message: isFileTooLage
        ? '업로드 용량 제한(최대 10MB)을 초과했습니다.'
        : '업로드 처리 중 오류가 발생했습니다.',
      details: err.code
    });
  }

  // 사용자가 이미지 아닌 파일 보냈을 때 (fileFilter에서 던진 error)
  if (err && err.message === '이미지 파일만 업로드 가능합니다.') {
    return res.status(400).json({ ok: false, message: err.message });
  }

  // 그 외 일반 에러
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { errorHandler };
