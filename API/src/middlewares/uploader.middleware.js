const multer = require('multer');
const fs = require('fs');
const {randomStringGenerator} = require('../utils/helper')
const {fileFilterType} = require('../config/constants.config')


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
      let fileExt = file.originalname.split('.').pop();  //returns an array of the file name and the extension and pop() returns the last element of the array
      let filename = `${randomStringGenerator(10)}-${Date.now()}.${fileExt}`;
      console.log(filename);
      cb(null,filename )
    }
  })




// create a uploadfile middleware that takes file type and validates it 
const uploadFile = (fileType=fileFilterType.IMAGE)=>{
  const allowedExt = ['png','jpg','jpeg','gif'];
  if (fileType==fileFilterType.DOC){
    allowedExt  = ['pdf','doc','docx','txt']
  }


  return multer ({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        let fileExt = file.originalname.split('.').pop();  //maybe sometimes mahe uppercase extension




        if(allowedExt.includes(fileExt.toLowerCase())){
            cb(null,true);}
            else{
              cb({code:400,message:`file format not allowed`},false)
            }
    },
    limits:{ fileSize: 1024*1024*5}//5MB


});
}

// const uploader= multer ({
//     storage:storage,
//     fileFilter:(req,file,cb)=>{
//         let fileExt = file.originalname.split('.').pop();  //maybe sometimes mahe uppercase extension


//        let allowedExt = ['png','jpg','jpeg','gif'];


//         if(allowedExt.includes(fileExt.toLowerCase())){
//             cb(null,true);}
//             else{
//               cb({code:400,message:`file format not allowed`},false)
//             }
//     },
//     limits:{ fileSize: 1024*1024*5}//5MB


// });



const setPath = (path)=>{
    return (req,res,next)=>{
        req.uploadPath = path;
        next();
    };
}



module.exports = {
    uploadFile,
    setPath
}