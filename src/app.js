import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { PORT } from '../constants.js';
import stylesRouter from './routers/stylesRouter.js';

const app = express();
app.use(express.json());

app.use(cors());

app.use('/styles', stylesRouter);

app.listen(PORT || 3000, () => console.log('server started'));
