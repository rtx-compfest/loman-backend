const jwt = require("jsonwebtoken")
require("dotenv").config()
var key = process.env.JWT_KEY
var projectName = process.env.PROJECT_NAME

function generate(username) {
  return jwt.sign({ username: username, project: projectName }, key)
}

function verify(req, res, next) {
  try {
    let token = req.headers.authorization
    var decoded = jwt.verify(token, key)
    if (decoded.project == projectName) {
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
