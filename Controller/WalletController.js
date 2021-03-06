const express = require("express")
const {
  AdminChecker,
  DonorChecker,
  FundraiserChecker,
} = require("../Middleware")
const { WalletService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")

const router = express.Router()
const walletService = new WalletService()

router.get("/", async function (req, res, next) {
  const data = await walletService.getAll()
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/request", AdminChecker, async function (req, res, next) {
  const data = await walletService.getRequest()
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/user/:userid", AdminChecker, async function (req, res, next) {
  const data = await walletService.getWithdrawByUser(req.params.userid)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get(
  "/donation_program/:id",
  AdminChecker,
  async function (req, res, next) {
    const data = await walletService.getWithdrawByDonationProgram(req.params.id)
    if (!data) return next(new ErrorHandler(404, "Data is not found"))
    res.status(200).json({
      data: data,
      status: true,
    })
  }
)

// Topup wallet

router.post("/topup", DonorChecker, async function (req, res, next) {
  const data = await walletService.topUp(req.user.userId, req.body)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
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
    if (!data) return next(new ErrorHandler(404, "Data is not found"))
    if (data.limitAmount)
      return next(new ErrorHandler(404, "Amount is unficient"))
    res.status(200).json({
      message: "Donation successful",
      data: {
        status_transaction: data["status_transaction"],
        id: data["id"],
        credit_id: data["credit_id"],
        debit_id: data["debit_id"],
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
    if (!data) return next(new ErrorHandler(404, "Data is not found"))
    if (data.limitAmount)
      return next(new ErrorHandler(404, "Amount is unficient"))
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

  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  if (data.limit) return next(new ErrorHandler(404, "Unficient amount"))
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
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
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
