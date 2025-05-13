const multer = require('multer');
const fs = require('fs');
const { randomStringGenerator } = require('../utils/helper');
const { fileFilterType } = require('../config/constants.config');

// Define multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/uploads/${req.uploadPath}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${randomStringGenerator(10)}-${Date.now()}.${fileExt}`;
    console.log(filename);
    cb(null, filename);
  }
});

// Upload middleware factory
const uploadFile = (fileType = fileFilterType.IMAGE) => {
  let allowedExt = ['png', 'jpg', 'jpeg', 'gif'];
  if (fileType === fileFilterType.DOC) {
    allowedExt = ['pdf', 'doc', 'docx', 'txt'];
  }

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      if (allowedExt.includes(fileExt)) {
        cb(null, true);
      } else {
        cb({ code: 400, message: 'File format not allowed' }, false);
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
  });
};

// Middleware to set upload path
const setPath = (path) => {
  return (req, res, next) => {
    req.uploadPath = path;
    next();
  };
};

module.exports = {
  uploadFile,
  setPath
};
