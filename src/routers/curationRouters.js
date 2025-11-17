import express from 'express';
import { updateCuration, deleteCuration } from '../controllers/curationController.js';
import { createComment } from '../controllers/commentController.js';
import { curationValidator } from '../middlewares/curationValidator.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { PatchCuration } from '../structs/curationStructs.js';
import { CreateComment } from '../structs/commentStructs.js';
import { verifyPassword, verifyStylePassword } from '../middlewares/passwordValidator.js';

const curationRouter = express.Router();

curationRouter
  .route('/:curationId')
  .put(curationValidator(PatchCuration), verifyPassword, updateCuration)
  .delete(verifyPassword, deleteCuration);

curationRouter
  .route('/:curationId/comments')
  .post(commentValidator(CreateComment), verifyStylePassword, createComment);

export default curationRouter;
