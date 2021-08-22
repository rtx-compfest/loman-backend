const express = require("express")
const { UserService } = require("../Service")
const { ErrorHandler } = require("../Util/ErrorHandler")
const handlerInput = require("../Util/ValidationHandler")
const { AdminChecker, UserValidation } = require("../Middleware")

const router = express.Router()
const userService = new UserService()

router.get("/", async function (req, res, next) {
  const data = await userService.getAll()
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/fundraiser", async function (req, res, next) {
  const data = await userService.getFundraiser(req.query)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/donor", async function (req, res, next) {
  const data = await userService.getDonor(req.query)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res, next) {
  const data = await userService.getById(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Data is not found"))
  res.status(200).json({
    data: data,
    status: true,
  })
})

// Registration
router.post(
  "/register",
  UserValidation(),
  handlerInput,
  async function (req, res, next) {
    const data = await userService.register(req.body)
    if (!data) return next(new ErrorHandler(404, "Some field is empty"))
    res.status(200).json({
      message: "Pendaftaran Berhasil",
      data: data,
      status: true,
    })
  }
)

// Login
router.post("/login", async function (req, res, next) {
  const data = await userService.login(req.body)
  if (!data) return next(new ErrorHandler(404, "Account is not found"))

  res.status(200).json({
    message: "Login successful",
    data: data.data,
    token: data.token,
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
      data: {},
      status: true,
    })
})

// Verify fundraiser registration
router.post("/verify/:id", AdminChecker, async function (req, res, next) {
  const data = userService.verify(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Account is not found"))
  res.status(200).json({
    status: true,
    message: "Verify registration successful",
    data: data,
  })
})

// Reject fundraiser registration
router.post("/reject/:id", AdminChecker, async function (req, res, next) {
  const data = userService.reject(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Account is not found"))
  res.status(200).json({
    status: true,
    message: "Reject registration successful",
    data: data,
  })
})

router.put("/:id", async function (req, res, next) {
  const data = await userService.update(req.params.id, req.body)
  if (!data) return next(new ErrorHandler(404, "Account is not found"))
  res.status(200).json({
    message: "Account is updated",
    data: data,
    status: true,
  })
})

router.delete("/:id", async function (req, res, next) {
  const data = await userService.remove(req.params.id)
  if (!data) return next(new ErrorHandler(404, "Account is not found"))
  res.status(200).json({
    message: "Account is deleted",
    data: data,
    status: true,
  })
})

module.exports = router
