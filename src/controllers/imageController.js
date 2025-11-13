import { prisma } from '../utils/prisma.js';

function uploadTestController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: 'image 필드에 파일을 업로드해야 합니다.',
      });
    }

    return res.status(201).json({
      ok: true,
      message: '업로드 테스트 성공',
      body: req.body, // 함께 전송한 텍스트들
      file: {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (err) {
    next(err);
  }
}

//** ---- export 방식 (현재 파일에 형태에 맞춰 하나만 선택 ) ----- **/

// 1) 이미 module.exports = { ... } 형태면 여기에 추가:
module.exports = {
  uploadTestController,
};

//2) 라우터에 테스트 엔드포인트 연결 - 챗지피티 - How Do I Look
