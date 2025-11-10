import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import config from './config.js';
import { createAppLogger } from './logger.js';
import { loadErrorHandlers, loadValidationRules } from './utils/errorLoader.js';
import { errorHandler } from './middleware.js';
import { setupRoutes } from './routes.js';

/**
 * 서버 클래스
 */
class Server {
  constructor() {
    this.app = express();
    this.config = config;
    this.logger = createAppLogger(this.config);
    this.errorHandlers = {};
    this.validationRules = {};
  }

  /**
   * 미들웨어 설정
   */
  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  /**
   * 설정 데이터 로드
   */
  async loadConfiguration() {
    this.errorHandlers = await loadErrorHandlers(this.config.errorHandlerDir);
    this.validationRules = await loadValidationRules(
      this.config.errorHandlerDir
    );
    this.logger.info('Configuration loaded successfully');
  }

  /**
   * 라우트 및 에러 핸들러 설정
   */
  setupRoutesAndErrors() {
    setupRoutes(this.app, this.errorHandlers);
    this.app.use(errorHandler(this.logger));
  }

  /**
   * 서버 시작
   */
  async start() {
    try {
      await this.loadConfiguration();
      this.setupMiddleware();
      this.setupRoutesAndErrors();

      const server = this.app.listen(this.config.port, () => {
        this.logger.info(`서버가 포트 ${this.config.port}에서 실행 중입니다.`);
      });

      // graceful shutdown
      this.setupGracefulShutdown(server);
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown 설정
   * @param {Object} server - HTTP 서버 인스턴스
   */
  setupGracefulShutdown(server) {
    const shutdown = (signal) => {
      this.logger.info(`${signal} received, shutting down gracefully`);
      server.close(() => {
        this.logger.info('Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  /**
   * 앱 인스턴스 반환 (테스트용)
   */
  getApp() {
    return this.app;
  }
}

export default Server;
