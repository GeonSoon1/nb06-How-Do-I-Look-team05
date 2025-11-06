import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { PORT } from '../constants.js';

const app = express();
app.use(express.json());

app.use(cors());

app.listen(PORT || 3000, () => console.log('server started'));
