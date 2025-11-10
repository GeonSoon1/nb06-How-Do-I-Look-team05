import express from 'express';
import AppError from './errors/AppError.js';

/**
 * 라우트 설정 함수
 * @param {Object} app - Express 앱 인스턴스
 * @param {Object} errorHandlers - 에러 핸들러 데이터
 */
export function setupRoutes(app, errorHandlers) {
  // 기본 라우트
  app.get('/', (req, res) => {
    res.json({ message: 'Express API 서버가 실행 중입니다.' });
  });

  // 에러 발생 예시 라우트
  app.get('/error/:type', (req, res, next) => {
    const { type } = req.params;
    const module = 'comment'; // 예시로 comment 모듈 사용

    if (errorHandlers[module]) {
      const errorDef = errorHandlers[module].find((e) =>
        e.code.toLowerCase().includes(type.toLowerCase())
      );
      if (errorDef) {
        return next(
          new AppError(
            errorDef.code,
            errorDef.message,
            errorDef.httpStatus,
            errorDef.fields
          )
        );
      }
    }

    next(new AppError('UNKNOWN_ERROR', '알 수 없는 오류입니다.', 500));
  });

  // 404 핸들러
  app.use('*', (req, res, next) => {
    next(new AppError('NOT_FOUND', '요청하신 리소스를 찾을 수 없습니다.', 404));
  });
}
