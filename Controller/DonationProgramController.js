var express = require("express")
const { db } = require("../Database")
const UploadImage = require("../Util/UploadImage")
var router = express.Router()
const multer = require("multer")
const uploadImage = new UploadImage(multer, "donation_program").upload

router.get("/", async function (req, res) {
  let data = await db.donationProgram.findByNameAndCategory(
    req.query.category,
    req.query.nama,
    req.query.orderBy,
    req.query.sort
  )
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/fundraiser/:id", async function (req, res) {
  let id = req.params.id
  let data = await db.donationProgram.findByFundanaiser(
    id,
    req.query.nama,
    req.query.orderBy,
    req.query.sort
  )
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/donor/:id", async function (req, res) {
  let id = req.params.id
  let data = await db.donorDonation.findByUser(id)
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res) {
  let id = req.params.id
  try {
    let data = await db.donationProgram.find(id)

    data.donor = await db.donorDonation.findByDonationProgram(id)
    res.status(200).json({
      data: data,
      status: true,
    })
  } catch (e) {
    res.status(200).json({
      data: {},
      status: false,
    })
  }
})

router.post("/", uploadImage.single("photos"), async function (req, res) {
  req.body.status = 0
  req.body.photos = req.file.filename

  let data = await db.donationProgram.add(req.body)
  if (data) {
    res.status(200).json({
      message: "Berhasil dimasukkan",
      data: data,
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      status: false,
    })
  }
})

//Upload Gambar
router.post("/:id", uploadImage.any(), async function (req, res, next) {
  if (req.files.length > 0) {
    req.body.photos = req.files[0].filename
  }
  next()
})

router.post("/:id", async function (req, res) {
  req.body.id = req.params.id
  if (req.file) {
    req.body.photos = req.file.filename
  }
  let data = await db.donationProgram.update(req.body)
  if (data) {
    res.status(200).json({
      message: "Berhasil diubah",
      data: data,
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      status: false,
    })
  }
})

router.delete("/:id", async function (req, res) {
  let data = await db.donationProgram.remove(req.params.id)
  res.status(200).json({
    message: "Berhasil dihapus",
    data: data,
    status: true,
  })
})

module.exports = router
