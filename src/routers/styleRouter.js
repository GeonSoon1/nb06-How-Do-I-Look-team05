import express from 'express';
import { CreateStyle, PatchStyle } from '../structs/styleStructs.js';
import { createStyle, patchStyle } from '../controllers/styleController.js';
import { validate } from '../middlewares/styleValidator.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
router.route('/').post(upload.array('images', 5), validate(CreateStyle), createStyle);

router.route('/:id').patch(upload.array('images', 5), validate(PatchStyle), patchStyle);
export default router;
