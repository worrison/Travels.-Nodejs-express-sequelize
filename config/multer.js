const Multer = require('multer');

const storage = Multer.diskStorage({

    destination: (req, file, callback) => {
    callback(null, './public/upload'); // relativo al archivo principal del repo
 },
 filename: (req, file, callback) => {
 callback(null,  parseInt(Math.random()*100) + file.originalname);
 }
});
const upload = Multer({storage});
module.exports = upload;