import express from 'express';
import { CreateStyle, PatchStyle } from '../structs/styleStructs.js';
import { createStyle, patchStyle, deleteStyle } from '../controllers/styleController.js';
import { validate } from '../middlewares/styleValidator.js';
import { upload } from '../middlewares/upload.js';
import { createStyleCuration } from '../controllers/curationController.js';
import { hashPassword, verifyPassword } from '../middlewares/passwordValidator.js';

const router = express.Router();

router.route('/').post(upload.array('images', 5), validate(CreateStyle), hashPassword, createStyle);
router
  .route('/:styleId')
  .patch(upload.array('images', 5), validate(PatchStyle), verifyPassword, patchStyle)
  .delete(upload.none(), verifyPassword, deleteStyle);

// 큐레이팅 등록
router.post('/:styleId/curations', createStyleCuration);

export default router;
