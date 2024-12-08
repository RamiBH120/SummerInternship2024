const multer = require('multer')

const storageCert = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/certificate/') // Assurez-vous que ce répertoire existe
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' +file.originalname)
    }
});

const uploadCert = multer({ storage: storageCert }).single('certificate');

const storageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/image/') // Assurez-vous que ce répertoire existe
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' +file.originalname)
    }
});

const uploadImgUser = multer({ storage: storageImg }).single('image');
module.exports = {
   
    uploadCert,
    uploadImgUser
};