const multer = require ("multer");
const myStorage= multer.diskStorage({
    destination: (req,file,cb) => 
        //dir where you upload your file
        {
            const path ="./public/uploads/banner"
        }
})
const uploader = multer ({
    storage: myStorage
})

const setpath = (path) => {
    return 
}

module.exports = {
    uploader
}