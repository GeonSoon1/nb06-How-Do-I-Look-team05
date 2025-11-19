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
  getStyle
} from '../controllers/styleController.js';
import { createStyleCuration, getStyleCuration } from '../controllers/curationController.js';
import { CreateCuration } from '../structs/curationStructs.js';
import { curationValidator } from '../middlewares/curationValidator.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = express.Router();

router
  .route('/')
  .post(upload.array('images', 10), validate(CreateStyle), hashPassword, asyncHandler(createStyle))
  .get(asyncHandler(getStyle));

router
  .route('/:styleId')
  .patch(upload.array('images', 10), validate(PatchStyle), verifyPassword, asyncHandler(patchStyle))
  .delete(upload.none(), verifyPassword, asyncHandler(deleteStyle))
  .get(asyncHandler(getStyleDetail));

router
  .route('/:styleId/curations')
  .post(
    upload.none(),
    curationValidator(CreateCuration),
    hashPassword,
    asyncHandler(createStyleCuration)
  )
  .get(asyncHandler(getStyleCuration));

export default router;
