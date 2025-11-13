/**
 * 커스텀 애플리케이션 에러 클래스
 * 운영 에러를 처리하기 위한 표준화된 에러 구조를 제공합니다.
 */
class AppError extends Error {
  /**
   * AppError 생성자
   * @param {string} code - 에러 코드 (예: 'VALIDATION_ERROR')
   * @param {string} message - 사용자 친화적인 에러 메시지
   * @param {number} [statusCode=500] - HTTP 상태 코드
   * @param {Array<string>} [fields=[]] - 유효성 검사 실패한 필드 목록
   * @throws {TypeError} 입력 파라미터가 올바르지 않은 경우
   */
  constructor(code, message, statusCode = 500, fields = []) {
    // 입력 유효성 검사
    if (typeof code !== 'string' || !code.trim()) {
      throw new TypeError('에러 코드는 비어있지 않은 문자열이어야 합니다.');
    }
    if (typeof message !== 'string' || !message.trim()) {
      throw new TypeError('에러 메시지는 비어있지 않은 문자열이어야 합니다.');
    }
    if (
      typeof statusCode !== 'number' ||
      statusCode < 100 ||
      statusCode > 599
    ) {
      throw new TypeError(
        'HTTP 상태 코드는 100에서 599 사이의 숫자여야 합니다.'
      );
    }
    if (!Array.isArray(fields)) {
      throw new TypeError('필드 목록은 배열이어야 합니다.');
    }

    super(message);

    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
    this.isOperational = true;

    // 스택 트레이스를 생성자 함수에서 제외하여 더 깔끔한 출력
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 에러 정보를 JSON 형태로 반환
   * @returns {Object} 에러 정보 객체
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      fields: this.fields,
      isOperational: this.isOperational,
      stack: this.stack,
    };
  }

  /**
   * 에러의 간단한 문자열 표현
   * @returns {string} 에러 문자열
   */
  toString() {
    return `${this.name} [${this.code}]: ${this.message} (Status: ${this.statusCode})`;
  }
}

export default AppError;
