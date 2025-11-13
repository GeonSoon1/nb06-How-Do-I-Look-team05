import express from 'express';
import { getStyleDetail, getStyles } from '../controllers/tagController.js';

const stylesRouter = express.Router();

stylesRouter.route('/').get(getStyles);

stylesRouter.route('/:id').get(getStyleDetail);

export default stylesRouter;
