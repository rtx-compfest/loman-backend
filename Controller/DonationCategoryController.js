const express = require("express")
const { DonationCategoryService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")

const router = express.Router()
const donationCategoryService = new DonationCategoryService()

router.get("/", async function (req, res, next) {
  const data = await donationCategoryService.getAll()
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res, next) {
  const data = await donationCategoryService.getById(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

module.exports = router
