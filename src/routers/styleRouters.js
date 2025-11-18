import express from 'express';
import { validate } from '../middlewares/styleValidator.js';
import { upload } from '../middlewares/formDataParser.js'; // 여기서 upload 가져옴
import { hashPassword, verifyPassword } from '../middlewares/passwordValidator.js';
import { CreateStyle, PatchStyle } from '../structs/styleStructs.js';
import {
  createStyle,
  patchStyle,
  deleteStyle,
  getStyleDetail,
  getStyles
} from '../controllers/styleController.js';
import { createStyleCuration, getStyleCuration } from '../controllers/curationController.js';
import { CreateCuration } from '../structs/curationStructs.js';
import { curationValidator } from '../middlewares/curationValidator.js';
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
// router.post('/:styleId/curation', upload.single('image'), createStyleCuration);
// createStyleCuration에서 req.body + req.file을 사용

router
  .route('/:styleId/curations')
  .post(curationValidator(CreateCuration), hashPassword, createStyleCuration)
  .get(getStyleCuration);

export default router;
