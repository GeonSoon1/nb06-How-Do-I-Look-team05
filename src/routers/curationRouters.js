import express from 'express';
import { updateCuration, deleteCuration } from '../controllers/curationController.js';
import { createComment } from '../controllers/commentController.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import { CreateComment } from '../structs/commentStructs.js';
const curationRouter = express.Router();

curationRouter.route('/:curationId').put(updateCuration).delete(deleteCuration);

curationRouter.route('/:curationId/comments').post(commentValidator(CreateComment), createComment);

export default curationRouter;
