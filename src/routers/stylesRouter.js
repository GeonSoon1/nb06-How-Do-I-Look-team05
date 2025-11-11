import express from 'express';
import { getStyleDetail, getStyles } from '../controllers/stylesControllers.js';

const stylesRouter = express.Router();

stylesRouter.route('/').get(getStyles);

stylesRouter.route('/:id').get(getStyleDetail);

export default stylesRouter;
