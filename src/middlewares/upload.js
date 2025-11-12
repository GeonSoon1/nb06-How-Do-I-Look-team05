import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(process.cwd(), 'uploads/'));
  },
  filename: function (req, file, cb) {
    const randomName = Math.random().toString().slice(2, 10);

    const date = new Date().toString().slice(0, 10).replace(/-/g, '');
    const extension = path.extname(file.originalname);
    const newFilename = `${randomName}_${date}${extension}`;
    cb(null, newFilename);
  }
});

export const upload = multer({ storage });
