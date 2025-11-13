import express from 'express';

// const <> = express.Router();

const { Router } = require('express'); //각 기능별로 라우터 모듈을 따로 만들 수 있게 Router라는 작은 라우터 객체를 제공
const { upload } = require('../middlewares/formDataParser'); // upload는 multer로 만든 middleware 이미지 파일을 분석해서 req.file에 담아준다.
const { uploadTestController } = require('../controllers/uploadTestController'); // 파일 업로드 테스트 요청이 오면 이 컨트롤러 보낸다

const router = Router();

// 테스트용 업로드
router.post('/upload-test', upload.single('image'), uploadTestController);

module.exports = router;
