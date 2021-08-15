const jwt = require("jsonwebtoken")
require("dotenv").config()
var key = process.env.JWT_KEY
var projectName = process.env.PROJECT_NAME

function generate(data) {
  return jwt.sign(
    {
      userId: data["id"],
      role: data["user_roles"],
      project: projectName
    },
    key,
  )
}

function verify(req, res, next) {
  try {
    const cookie = req.signedCookies
    const decoded = jwt.verify(cookie.token, key)
    if (decoded.project == projectName) {
      req.user = decoded
      next()
    } else {
      res.status(401).json({ status: false, message: "Token is not valid" })
    }
  } catch (err) {
    res.status(401).json({ status: false, message: "Token is not valid" })
  }
}

module.exports = {
  generate: generate,
  verify: verify,
}
