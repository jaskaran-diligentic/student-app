const cloudinary = require('cloudinary').v2;
const multer = require('multer');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const fileFilter = (req, file, cb) => {
  (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    ? cb(null, true) : cb(null, false)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})
module.exports = upload;