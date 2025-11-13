// 폼데이터 파싱 : 이미지 + 텍스트 병합 요청 처리

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// 1) 업로드 폴더 경로 설정
const uploadDir = path.join(process.cwd); //현재 작업 디렉토리(process.cwd()) 안에 있는 ‘uploads’ 폴더 경로를 만든다

// 2) 폴더가 없으면 생성
// !fs.existsSync(uploadDir) -> uploadDir 파일이 존재하지 않으면(true) uploadDir 폴더를 만들어라
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir), { recursive: true };
}

// 3) 저장 방식 설정
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const unique = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.orginalname);
    cb(null, unique + ext);
  },
});

// 4) 이미지 파일만 허용하는 필터
function fileFilter(_req, file, cb) {
  if (/^image\//.test(file.mimtype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
}

// 5) multer 인스턴스 생성
const upload = multer({
  storage,
  limits: {
    filesize: 10 * 2024 * 2024, //10MB
  },
  fileFilter,
});

// 6) 내보내기
module.exports = {
  upload,
};
