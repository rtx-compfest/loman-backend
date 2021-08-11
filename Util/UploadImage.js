class UploadImage {
  constructor(multer, folder) {
    this.multer = multer
    this.storage = this.multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/uploads/image/" + folder)
      },

      filename: function (req, file, cb) {
        cb(null, file.originalname)
      },
    })
    this.upload = multer({
      storage: this.storage,
    })
  }
}

module.exports = UploadImage
