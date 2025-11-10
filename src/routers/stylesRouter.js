import express from 'express';
import { getStyles } from '../controllers/stylesControllers.js';

const stylesRouter = express.Router();

stylesRouter.route('/').get(getStyles);

export default stylesRouter;
