var express = require("express")
const { db } = require("../Database")
var router = express.Router()
const AdminChecker = require("../Middleware/AdminChecker")
const DonorChecker = require("../Middleware/DonorChecker")
const FundraiserChecker = require("../Middleware/FundraiserChecker")
const { WalletService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")
const walletService = new WalletService()
// Topup wallet
router.post("/topup", DonorChecker, async function (req, res, next) {
  const data = await walletService.topUp(req.user.userId, req.body)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    message: "Topup successful",
    data: {
      status_transaction: data["status_transaction"],
      id: data["id"],
    },
    status: true,
  })
})

// Donate
router.post(
  "/donate/:donationId",
  DonorChecker,
  async function (req, res, next) {
    const data = await walletService.donate(
      req.user.userId,
      req.params.donationId,
      req.body
    )
    if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
    res.status(200).json({
      message: "Donation successful",
      data: {
        status_transaction: data["status_transaction"],
        id: data["id"],
      },
      status: true,
    })
  }
)

// Request Withdraw
router.post(
  "/withdraw/:donationId",
  FundraiserChecker,
  async function (req, res, next) {
    const data = await walletService.withdraw(
      req.user.userId,
      req.params.donationId,
      req.body
    )
    if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
    if (data.limitAmount)
      return next(new ErrorHandler(404, "Amount tidak cukup"))
    res.status(200).json({
      message: "Request withdraw successful",
      data: {
        status_transaction: data["status_transaction"],
        id: data["id"],
      },
      status: true,
    })
  }
)

// Admin verify wd request
router.post("/verify/:id", AdminChecker, async function (req, res, next) {
  const data = await walletService.verify(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    message: "Verify Withdraw successful",
    data: {
      status_transaction: data["status_transaction"],
      id: data["id"],
    },
    status: true,
  })
})

router.post("/reject/:id", AdminChecker, async function (req, res, next) {
  const data = await walletService.reject(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    message: "Reject Withdraw successful",
    data: {
      status_transaction: data["status_transaction"],
      id: data["id"],
    },
    status: true,
  })
})

module.exports = router
