import express from 'express';
import { patchComment } from '../controllers/commentController.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { PatchComment } from '../structs/commentStructs.js';

const commentRouter = express.Router();

commentRouter.route('/:commentId').patch(commentValidator(PatchComment), patchComment);

export default commentRouter;
