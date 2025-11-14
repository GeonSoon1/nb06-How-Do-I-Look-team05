import express from 'express';
import { getRanking } from '../controllers/rankingControllers.js';

const rankingRouter = express.Router();

rankingRouter.get('/', getRanking);

export default rankingRouter;
