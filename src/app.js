import cors from 'cors';
import express from 'express';
import { PORT } from './utils/constants.js';
import styleRouter from './routers/styleRouter.js';
import curationRouter from './routers/curationRouters.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/curations', curationRouter);

app.use('/styles', styleRouter);

app.listen(PORT || 3000, () => console.log('server started'));
