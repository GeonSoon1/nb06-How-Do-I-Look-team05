import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { PORT } from './utils/constants.js';
import curationRouter from './routers/curationRouters.js'

const app = express();
app.use(cors());
app.use(express.json());


app.use('/curations', curationRouter)

app.listen(PORT || 3000, () => console.log('server started'));
