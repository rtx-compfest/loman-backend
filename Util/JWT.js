const jwt = require("jsonwebtoken")
const { ErrorHandler } = require("./ErrorHandler")
require("dotenv").config()
const key = process.env.JWT_KEY
const projectName = process.env.PROJECT_NAME

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
    let token = req.headers.authorization
    // if (!token) {
    //   token
    // }
    const decoded = jwt.verify(token, key)
    if (decoded.project == projectName) {
      req.user = decoded
      next()
    } else {
      return next(new ErrorHandler(401, "Token is not valid"))
    }
  } catch (err) {
    return next(new ErrorHandler(401, "Token is not valid"))
  }
}

module.exports = {
  generate: generate,
  verify: verify,
}
