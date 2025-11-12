import express from 'express';
import { CreateStyle } from '../structs/styleStructs.js';
import { createStyle } from '../controllers/styleController.js';
import { validate } from '../middlewares/styleValidator.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
router.route('/').post(upload.array('images', 5), validate(CreateStyle), createStyle);

export default router;
