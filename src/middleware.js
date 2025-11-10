import Joi from 'joi';
import AppError from './errors/AppError.js';

/**
 * 유효성 검사 미들웨어
 * @param {Object} schema - Joi 스키마
 * @returns {Function} 미들웨어 함수
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const fields = error.details.map((detail) => ({
        field: detail.path.join('.'),
        reason: detail.message,
      }));
      return next(
        new AppError(
          'VALIDATION_FAILED',
          '요청 유효성 검사를 통과하지 못했습니다.',
          400,
          fields
        )
      );
    }
    next();
  };
};

/**
 * 에러 핸들링 미들웨어
 * @param {Error} err - 에러 객체
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어
 */
export const errorHandler = (logger) => {
  return (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // 로그 기록
    logger.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    // AppError인 경우
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
          fields: err.fields,
        },
      });
    }

    // 기본 에러 응답
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '서버 내부 오류가 발생했습니다.',
      },
    });
  };
};
