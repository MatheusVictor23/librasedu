import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (allowedMimes) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado!'), false);
  }
};

export const uploadVideo = multer({
  storage: storage,
  fileFilter: fileFilter(['video/mp4', 'video/quicktime', 'video/webm']),
  limits: { fileSize: 50 * 1024 * 1024 }
});

export const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'application/pdf']),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/gif']),
  limits: { fileSize: 5 * 1024 * 1024 }
});