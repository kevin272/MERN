const multer = require("multer");
const fs = require("fs");
const { randomStringGenerator } = require("../utils/helper");
const { fileFilterType } = require("../config/constants.config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/uploads/${req.uploadPath}`;

    // if folder doesnot exist make directory
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    cb(null, path);
  },
  fileFilter: (req, file, cb) => {
    let fileExt = file.originalname.split(".").pop(); 
    if (allowedExt.includes(fileExt.toLowerCase())) {
      cb(null, true); // Accept file
    } else {
      cb(new Error(`File format not allowed`), false); // Reject file
    }
  },
  
});

// create a uploadfile middleware that takes file type and validates it
const uploadFile = (fileType = fileFilterType.IMAGE) => {
  let allowedExt = ["png", "jpg", "jpeg", "gif","webp","bmp"];
  if (fileType == fileFilterType.DOC) {
   allowedExt = ["pdf", "doc", "docx", "txt", "docx"];
  }

  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      let fileExt = file.originalname.split(".").pop(); //maybe sometimes it can have uppercase extension
      if (allowedExt.includes(fileExt.toLowerCase())) {
        cb(null, true);
      } else {
        cb({ code: 400, message: `file format not allowed` }, false);
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, //5MB
  });
};



const setPath = (path) => {
  return (req, res, next) => {
    req.uploadPath = path;
    next();
  };
};

module.exports = {
  uploadFile,
  setPath,
};