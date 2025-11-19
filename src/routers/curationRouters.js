import express from 'express';
import { updateCuration, deleteCuration } from '../controllers/curationController.js';
import { createComment } from '../controllers/commentController.js';
import { curationValidator } from '../middlewares/curationValidator.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { PatchCuration } from '../structs/curationStructs.js';
import { CreateComment } from '../structs/commentStructs.js';
import { verifyPassword, verifyStylePassword } from '../middlewares/passwordValidator.js';
import { upload, textParser } from '../middlewares/formDataParser.js'; // 여기서 upload 가져옴
import { asyncHandler } from '../middlewares/asyncHandler.js';


const curationRouter = express.Router();

curationRouter
  .route('/:curationId')
  .put(upload.none(), curationValidator(PatchCuration), verifyPassword, asyncHandler(updateCuration))
  .delete(upload.none(), verifyPassword, asyncHandler(deleteCuration));

curationRouter
  .route('/:curationId/comments')
  .post(
    textParser,
    commentValidator(CreateComment),
    verifyStylePassword,
    asyncHandler(createComment)
  );

export default curationRouter;
