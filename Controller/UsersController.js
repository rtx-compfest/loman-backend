var express = require("express")
const { UserService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")
var router = express.Router()

const handlerInput = require("../Util/ValidationHandler")
const validation = require("../Middleware/UserValidation")
const AdminChecker = require("../Middleware/AdminChecker")
const userService = new UserService()

router.get("/", async function (req, res, next) {
  let data = await userService.getAll()
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/fundraiser", async function (req, res, next) {
  let data = await userService.getFundraiser(req.query)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/donor", async function (req, res, next) {
  let data = await userService.getDonor(req.query)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res, next) {
  let data = await userService.getById(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Data tidak ditemukan"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

// Registration
router.post(
  "/register",
  validation(),
  handlerInput,
  async function (req, res, next) {
    let data = await userService.register(req.body)
    if (!data) return next(new ErrorHandler(404, "Pendaftaran gagal"))
    res.status(200).json({
      message: "Pendaftaran Berhasil",
      data: data,
      status: true,
    })
  }
)

// Login
router.post("/login", async function (req, res, next) {
  let data = await userService.login(req.body)
  if (!data) return next(new ErrorHandler(404, "Akun tidak ditemukan"))

  res
    .cookie("token", data.token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60000),
      httpOnly: false,
      signed: true,
      sameSite: "strict",
      secure: true,
    })
    .status(200)
    .json({
      message: "Login successful",
      data: data,
      status: true,
    })
})

// Logout
router.post("/logout", async function (req, res) {
  res
    .clearCookie("token", {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: true,
    })
    .status(200)
    .json({
      message: "Logout successful",
      data: null,
      status: true,
    })
})

// Verify fundraiser registration
router.post("/verify/:id", AdminChecker, async function (req, res) {
  const data = userService.verify(req.params.id)
  if (!data) next(new ErrorHandler(404, "Terjadi kesalahan saat input"))
  res.status(200).json({
    status: true,
    message: "Verify registration successful",
    data: data,
  })
})

// Reject fundraiser registration
router.post("/reject/:id", AdminChecker, async function (req, res) {
  const data = userService.reject(req.params.id)
  if (!data) next(new ErrorHandler(404, "Terjadi kesalahan saat input"))
  res.status(200).json({
    status: true,
    message: "Reject registration successful",
    data: data,
  })
})

router.put("/:id", async function (req, res, next) {
  let data = await userService.update(req.params.id, req.body)
  if (!data) return next(new ErrorHandler(404, "Gagal diubah"))
  res.status(200).json({
    message: "Berhasil diubah",
    data: data,
    status: true,
  })
})

router.delete("/:id", async function (req, res, next) {
  let data = await userService.remove(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Gagal dihapus"))
  res.status(200).json({
    message: "Berhasil dihapus",
    data: data,
    status: true,
  })
})

module.exports = router
