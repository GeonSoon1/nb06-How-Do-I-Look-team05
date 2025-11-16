import express from 'express';
import { upload } from '../middlewares/upload.js'; // 여기서 upload 가져옴
import { patchComment, deleteComment } from '../controllers/commentController.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { verifyPassword } from '../middlewares/passwordValidator.js';
import { PatchComment } from '../structs/commentStructs.js';

const commentRouter = express.Router();

commentRouter
  .route('/:commentId')
  .patch(commentValidator(PatchComment), verifyPassword, patchComment)
  .delete(upload.none(), verifyPassword, deleteComment);

export default commentRouter;
