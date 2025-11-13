import cors from 'cors';
import express from 'express';
import { PORT } from './utils/constants.js';

import curationRouter from './routers/curationRouters.js';
<<<<<<< HEAD
import imageRouter from './routers/imageRouters.js';
=======
import stylesRouter from './routers/tagRouters.js';
import tagsRouter from './routers/tagsRouters.js';
>>>>>>> 0dd5274 (🐛 fix(get-styles):버그 수정 및 코드 리팩토링)

const app = express();
app.use(cors());
app.use(express.json());
app.use('/styles', styleRouter);

app.use('/curations', curationRouter);
<<<<<<< HEAD
app.use('/images', imageRouter);
=======

app.use('/styles', stylesRouter);

app.use('/tag', tagsRouter);
>>>>>>> 0dd5274 (🐛 fix(get-styles):버그 수정 및 코드 리팩토링)

// listener
app.listen(PORT || 3000, () => console.log(`Server listening on port ${PORT}!`));

const { errorHandler } = require('../middlewares/errorHandler');

app.use(errorHandler);
