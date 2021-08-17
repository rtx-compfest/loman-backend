var express = require("express")
const UploadImage = require("../Util/UploadImage")
var router = express.Router()
const multer = require("multer")
const { DonationProgramService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")
const FundraiserChecker = require("../Middleware/FundraiserChecker")
const AdminChecker = require("../Middleware/AdminChecker")
const uploadImage = new UploadImage(multer, "donation_program").upload
const donationProgramService = new DonationProgramService()

router.get("/", async function (req, res, next) {
  let data = await donationProgramService.getAll(req.query)
  if (!data) next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/fundraiser/:id", async function (req, res, next) {
  let data = await donationProgramService.getByFundraiser(
    req.params.id,
    req.query
  )
  if (!data) next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/donor/:id", async function (req, res, next) {
  let data = await donationProgramService.getByUser(req.params.id)
  if (!data) next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res, next) {
  let data = await donationProgramService.getById(req.params.id)
  if (!data) next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.post(
  "/",
  uploadImage.single("photos"),
  FundraiserChecker,
  async function (req, res, next) {
    req.body.photos = req.file.filename
    let data = await donationProgramService.add(req.body)
    if (!data) next(new ErrorHandler(404, "Some field is need filled"))
    res.status(200).json({
      message: "Berhasil dimasukkan",
      data: data,
      status: true,
    })
  }
)

// Verify Donation Program Creation
router.post("/verify/:id", AdminChecker, async function (req, res) {
  const data = donationProgramService.verify(req.params.id)
  if (!data) next(new ErrorHandler(404, "Donation program not found"))
  res.status(200).json({
    status: true,
    message: "Donation program verified",
    data: {},
  })
})

// Reject Donation Program Creation
router.post("/reject/:id", AdminChecker, async function (req, res) {
  const data = donationProgramService.reject(req.params.id)
  if (!data) next(new ErrorHandler(404, "Donation program not found"))
  res.status(200).json({
    status: true,
    message: "Donation program rejected",
    data: {},
  })
})

//Upload Gambar
router.post("/:id", uploadImage.any(), async function (req, res, next) {
  if (req.files.length > 0) {
    req.body.photos = req.files[0].filename
  }
  next()
})

router.post("/:id", async function (req, res, next) {
  if (req.file) {
    req.body.photos = req.file.filename
  }
  let data = await donationProgramService.update(req.params.id, req.body)
  if (!data) next(new ErrorHandler(404, "Terjadi kesalaahan saat pengubahan"))
  res.status(200).json({
    message: "Berhasil diubah",
    data: data,
    status: true,
  })
})

router.delete("/:id", async function (req, res, next) {
  let data = await donationProgramService.remove(req.params.id)
  if (!data) next(new ErrorHandler(404, "Terjadi kesalahan saat penghapusan"))
  res.status(200).json({
    message: "Berhasil dihapus",
    data: data,
    status: true,
  })
})

module.exports = router
