import express from 'express';
import { validate } from '../middlewares/styleValidator.js';
import { upload } from '../middlewares/upload.js'; // 여기서 upload 가져옴
import { createStyleCuration } from '../controllers/curationController.js';
import { hashPassword, verifyPassword } from '../middlewares/passwordValidator.js';
import { CreateStyle, PatchStyle } from '../structs/styleStructs.js';
import { createStyle, patchStyle, deleteStyle } from '../controllers/styleController.js';
import { getStyleDetail, getStyles } from '../controllers/tagController.js';

const router = express.Router();

router
  .route('/')
  .post(upload.array('images', 5), validate(CreateStyle), hashPassword, createStyle)
  .get(getStyles);

router
  .route('/:styleId')
  .patch(upload.array('images', 5), validate(PatchStyle), verifyPassword, patchStyle)
  .delete(upload.none(), verifyPassword, deleteStyle)
  .get(getStyleDetail);

// 큐레이팅 등록 (스타일별, 이미지 1장)
router.post('/:styleId/curation', upload.single('image'), createStyleCuration);
//createStyleCuration에서 req.body + req.file을 사용
export default router;

// /styles/:styleId/curation로 들어오는 요청은 upload.single('image')거치고
