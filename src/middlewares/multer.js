const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,'./public/images');
    },
    filename:(req,file,callback) =>{
        callback(null,`${Date.now().toString()}-${file.originalname}`);
    }
});

const fileFilter = (req,file, callback) =>{
    const filesFormats = ['image/png', 'image/jpg','image/gif' ,'image/jpeg'];
    const isAccepted = filesFormats.find(fileFormat => fileFormat === file.mimetype);

    if(isAccepted){
        return callback(null,true);
    }else{
        return callback(null,false);
    }
}

module.exports = multer({
    storage,fileFilter
})