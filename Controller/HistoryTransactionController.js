var express = require("express")
const { db } = require("../Database")
var router = express.Router()
const AdminChecker = require("../Middleware/AdminChecker")
const DonorChecker = require("../Middleware/DonorChecker")
const FundraiserChecker = require("../Middleware/FundraiserChecker")

// Topup wallet
router.post("/topup", DonorChecker, async function (req, res) {
  const date = new Date()
  const body = {
    transaction_date:
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
    debit: req.body.amount,
    credit: 0,
    user_id: req.user.userId,
    donation_id: null,
    notes: req.body.notes,
  }

  const data = await db.historyTransaction.add(body)
  if (data !== null) {
    res.status(200).json({
      message: "Topup successful",
      data: {
        status_transaction: data["status_transaction"],
      },
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Topup error",
      data: {},
      status: false,
    })
  }
})

// Donate
router.post("/donate/:donationId", DonorChecker, async function (req, res) {
  const date = new Date()
  const body = {
    transaction_date:
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
    debit: req.body.amount,
    credit: 0,
    user_id: req.user.userId,
    donation_id: req.params.donationId,
    notes: req.body.notes,
    isVisible: req.body.isVisible,
  }

  const data = await db.historyTransaction.add(body)
  if (data !== null) {
    res.status(200).json({
      message: "Donation successful",
      data: {
        status_transaction: data["status_transaction"],
      },
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Topup error",
      data: {},
      status: false,
    })
  }
})

// Request Withdraw
router.post(
  "/withdraw/:donationId",
  FundraiserChecker,
  async function (req, res) {
    const date = new Date()
    let data = db.historyTransaction.find(req.params.donationId)
    let amount = 0
    for (let i = 0; i < data.length; i++) {
      amount = amount + data[i].debit - data[i].credit
    }
    const body = {
      transaction_date:
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
      debit: 0,
      credit: amount,
      user_id: req.user.userId,
      donation_id: req.params.donationId,
      notes: req.body.notes,
    }

    data = await db.historyTransaction.add(body)
    if (data !== null) {
      res.status(200).json({
        message: "Withdraw requested",
        data: {
          status_transaction: data["status_transaction"],
        },
        status: true,
      })
    } else {
      res.status(500).json({
        message: "Request error",
        data: {},
        status: false,
      })
    }
  }
)

// Admin verify wd request
router.post("/verify/:id", AdminChecker, async function (req, res) {
  const body = {
    id: req.params.id,
    status_transaction: 1,
  }
  const data = db.historyTransaction.update(body)
  if (data !== null) {
    res.status(200).json({
      message: "Withdraw accepted",
      data: {
        status_transaction: data["status_transaction"],
      },
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Internal server error",
      data: {},
      status: false,
    })
  }
})

router.post("/reject/:id", AdminChecker, async function (req, res) {
  const body = {
    id: req.params.id,
    status_transaction: 2,
  }
  const data = db.historyTransaction.update(body)
  if (data !== null) {
    res.status(200).json({
      message: "Withdraw rejected",
      data: {
        status_transaction: data["status_transaction"],
      },
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Internal server error",
      data: {},
      status: false,
    })
  }
})

module.exports = router
