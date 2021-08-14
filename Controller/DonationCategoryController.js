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
  let data = await db.donationCategory.find(id)
  res.status(200).json({
    data: data,
    status: true,
  })
})

module.exports = router
