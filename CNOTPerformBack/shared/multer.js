const multer = require('multer');
const fs = require('fs');

const date = new Date();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadPath = 'attachments';

      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
            cb(null, uploadPath);
      },
    filename: function(req, file, cb) {
      cb(null, `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}_${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;