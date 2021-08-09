var express = require("express")
const { db } = require("../Database")
var router = express.Router()

router.get("/", async function (req, res) {
  let data = await db.donationProgram.all()
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res) {
  let id = req.params.id
  let data = await db.donationProgram.get(id)
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.post("/", async function (req, res) {
  let data = await db.donationProgram.add(req.body)
  res.status(200).json({
    message: "Berhasil dimasukkan",
    data: data,
    status: true,
  })
})

router.put("/:id", async function (req, res) {
  req.body.id = req.params.id
  let data = await db.donationProgram.update(req.body)
  res.status(200).json({
    message: "Berhasil diubah",
    data: data,
    status: true,
  })
})

router.delete("/:id", async function (req, res) {
  req.body.id = req.params.id
  let data = await db.donationProgram.delete(req.id)
  res.status(200).json({
    message: "Berhasil dihapus",
    data: data,
    status: true,
  })
})

module.exports = router
