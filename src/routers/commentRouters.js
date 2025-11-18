import express from 'express';
import { upload, textParser } from '../middlewares/formDataParser.js'; // 여기서 upload 가져옴
import { patchComment, deleteComment } from '../controllers/commentController.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { verifyPassword } from '../middlewares/passwordValidator.js';
import { PatchComment } from '../structs/commentStructs.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const commentRouter = express.Router();

commentRouter
  .route('/:commentId')
  .patch(textParser, commentValidator(PatchComment), verifyPassword, asyncHandler(patchComment))
  .delete(upload.none(), verifyPassword, asyncHandler(deleteComment));

export default commentRouter;
