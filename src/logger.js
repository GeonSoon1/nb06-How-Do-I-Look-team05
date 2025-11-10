import {
  createLogger,
  format as _format,
  transports as _transports,
} from 'winston';

/**
 * 로거 생성 함수
 * @param {Object} config - 설정 객체
 * @returns {Object} Winston 로거 인스턴스
 */
export function createAppLogger(config) {
  const logger = createLogger({
    level: config.logLevel,
    format: _format.combine(
      _format.timestamp(),
      _format.errors({ stack: true }),
      _format.json()
    ),
    defaultMeta: { service: 'api-server' },
    transports: [
      new _transports.File({ filename: 'error.log', level: 'error' }),
      new _transports.File({ filename: 'combined.log' }),
    ],
  });

  if (config.nodeEnv !== 'production') {
    logger.add(
      new _transports.Console({
        format: _format.simple(),
      })
    );
  }

  return logger;
}
