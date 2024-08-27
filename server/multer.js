const multer = require('multer');
const fs = require("fs");
const path = require("path");

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
  };
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "uploads");
  
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      const isValid = FILE_TYPE_MAP[file.mimetype];
  
      let error = new Error("Invalid image type");
      if (isValid) {
        error = null;
      }
      cb(error, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(/\.[^/.]+$/, "").replace(/ /g, "-");
      const ext = FILE_TYPE_MAP[file.mimetype];
      const timestamp = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().replace(/:/g, '_');
      cb(null, `${fileName}-${timestamp}.${ext}`);
    },
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;