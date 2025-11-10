/**
 * 커스텀 에러 클래스
 */
class AppError extends Error {
  /**
   * @param {string} code - 에러 코드
   * @param {string} message - 에러 메시지
   * @param {number} statusCode - HTTP 상태 코드
   * @param {Array} fields - 유효성 검사 필드 에러들
   */
  constructor(code, message, statusCode = 500, fields = []) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
    this.isOperational = true;

    // Error.captureStackTrace를 사용하여 스택 트레이스 조정
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
