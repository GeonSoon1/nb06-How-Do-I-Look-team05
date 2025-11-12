import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { PORT } from './utils/constants.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(cors());

app.listen(PORT || 3000, () => console.log('server started'));
