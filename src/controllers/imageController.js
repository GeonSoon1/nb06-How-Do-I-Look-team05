import { prisma } from '../utils/prisma.js';
import fs from 'fs';

export function uploadTestController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: 'image 필드에 파일을 업로드해야 합니다.'
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
        path: req.file.path
      }
    });
  } catch (err) {
    next(err);
  }
}

// 실제 이미지 업로드용 (나중에 붙이 버전 예시)
export async function uploadLineImageController(req, res, next) {
  //
}
