import multer from 'multer';

export const uploadCsv = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'text/csv') return cb(new Error('Invalid file type'));
    cb(null, true);
  },
}).single('file');
