import express from 'express';
import { updateCuration, deleteCuration } from '../controllers/curationController.js';
import { createComment } from '../controllers/commentController.js';
const curationRouter = express.Router();

curationRouter.route('/:curationId').put(updateCuration).delete(deleteCuration);

curationRouter.route('/:curationId/comments').post(createComment);

export default curationRouter;
