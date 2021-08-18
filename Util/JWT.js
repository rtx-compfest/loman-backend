const jwt = require("jsonwebtoken")
const { ErrorHandler } = require("./ErrorHandler")
require("dotenv").config()
var key = process.env.JWT_KEY
var projectName = process.env.PROJECT_NAME

function generate(data) {
  return jwt.sign(
    {
      userId: data["id"],
      role: data["user_roles"],
      project: projectName,
    },
    key
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
      next(new ErrorHandler(401, "Token is not valid"))
    }
  } catch (err) {
    next(new ErrorHandler(401, "Token is not valid"))
  }
}

module.exports = {
  generate: generate,
  verify: verify,
}
