import express from 'express';
import { getRanking } from '../controllers/rankingController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
const rankingRouter = express.Router();

rankingRouter.get('/', asyncHandler(getRanking));

export default rankingRouter;
