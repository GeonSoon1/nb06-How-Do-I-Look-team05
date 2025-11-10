import Server from './server.js';

// 서버 인스턴스 생성 및 시작
const server = new Server();
server.start();

// 앱 인스턴스 export (테스트용)
export default server.getApp();
