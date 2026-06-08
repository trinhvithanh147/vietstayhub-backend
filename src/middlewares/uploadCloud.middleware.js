const multer = require("multer");

const uploadCloud = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = uploadCloud;
