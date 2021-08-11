var express = require("express")
const { db } = require("../Database")
var router = express.Router()

router.get("/", async function (req, res) {
  let data = await db.donationCategory.all()
  res.status(200).json({
    data: data,
    status: true,
  })
})
router.get("/:id", async function (req, res) {
  let id = req.params.id
  let data = await db.donationCategory.get(id)
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.put("/:id", async function (req, res) {
  req.body.id = req.params.id
  let data = await db.donationCategory.update(req.body)
  res.status(200).json({
    data: data,
    status: true,
  })
})

module.exports = router
