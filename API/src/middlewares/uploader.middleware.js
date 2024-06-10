const multer = require('multer');
const fs = require('fs');



// user,banner,brand,products
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const path = `./public/uploads/${req.uploadPath}`;

      // if folder doesnot exist make directory
      if(!fs.existsSync(path)){
          fs.mkdirSync(path,{recursive:true});
      }
      


      cb(null, path)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const uploader= multer ({
    storage:storage,
    fileFilter:(req,file,cb)=>{},
    limits:{}


});



const setPath = (path)=>{
    return (req,res,next)=>{
        req.uploadPath = path;
        next();
    };
}



module.exports = {
    uploader,
    setPath
}