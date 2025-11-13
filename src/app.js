import cors from 'cors';
import express from 'express';
import { PORT } from './utils/constants.js';
import styleRouter from './routers/styleRouter.js';
import curationRouter from './routers/curationRouters.js';
import imageRouter from './routers/imageRouters.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/styles', styleRouter);

app.use('/curations', curationRouter);
app.use('/images', imageRouter);

// listener
app.listen(PORT || 3000, () => console.log(`Server listening on port ${PORT}!`));

const { errorHandler } = require('../middlewares/errorHandler');

app.use(errorHandler);
