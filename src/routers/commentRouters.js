import express from 'express';
import { createComment } from '../controllers/commentController.js';

const commentRouter = express.Router();

// commentRouter.route('/:curationId').post('/comments', createComment);

export default commentRouter;
