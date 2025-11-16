import { Router } from 'express';
import { upload } from '../middlewares/formDataParser.js';
import { uploadTestController, uploadLineImageController } from '../controllers/imageController.js';

const router = Router();

router.post('/test', upload.single('image'), uploadTestController);

//router.post('/lines/:lineId/image', upload.single('image'), uploadLineController);

export default router;
