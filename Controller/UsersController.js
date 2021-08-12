var express = require("express")
const { db } = require("../Database")
var router = express.Router()
const { generate } = require("../Util/JWT")

router.get("/", async function (req, res) {
  let data = await db.users.all()
  res.status(200).json({
    data: data,
    status: true,
  })
})

router.get("/:id", async function (req, res) {
  let id = req.params.id
  let data = await db.users.get(id)
  res.status(200).json({
    data: data,
    status: true,
  })
})

// Registration
router.post("/register", async function (req, res) {
  let data = await db.users.add(req.body)
  if (data !== null) {
    res.status(200).json({
      message: "Registration successful",
      data: {
        "email": data["email"],
        "status_user": data["status_user"]
      },
      status: true,
    })
  } else {
    res.status(500).json({
      message: "Registration error",
      data: {},
      status: false,
    })
  }
})

// Login
router.post("/login", async function (req, res) {
  let data = await db.users.find(req.body)
  if (data !== null) {
    const token = generate(data)
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60000),
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        message: "Login successful",
        data: {
          "name": data["name"],
          "email": data["email"],
          "status_user": data["status_user"],
          "user_roles": data["user_roles"]
        },
        status: true,
      })
  } else {
    res.status(500).json({
      message: "Login error",
      data: {},
      status: false,
    })
  }
})

router.put("/:id", async function (req, res) {
  req.body.id = req.params.id
  let data = await db.users.update(req.body)
  res.status(200).json({
    message: "Berhasil diubah",
    data: data,
    status: true,
  })
})

router.delete("/:id", async function (req, res) {
  req.body.id = req.params.id
  let data = await db.users.remove(req.id)
  res.status(200).json({
    message: "Berhasil dihapus",
    data: data,
    status: true,
  })
})

module.exports = router
