import express from 'express';
import { getTags } from '../controllers/tagsControllers.js';

const tagsRouter = express.Router();

tagsRouter.route('/').get(getTags);

export default tagsRouter;
