import cors from 'cors';
import express from 'express';
import { PORT } from './utils/constants.js';
import imageRouter from './routers/imageRouters.js';
import { errorHandler } from './middlewares/errorHandler.js';
import curationRouter from './routers/curationRouters.js';
import styleRouter from './routers/styleRouters.js';
import tagsRouter from './routers/tagsRouters.js';
import rankingRouter from './routers/rankingRouters.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/styles', styleRouter);
app.use('/images', imageRouter);
app.use('/curations', curationRouter);
app.use('/tags', tagsRouter);
app.use('/ranking', rankingRouter);

app.use(errorHandler);

// listener
app.listen(PORT || 3000, () => console.log(`Server listening on port ${PORT}!`));

export default app;
