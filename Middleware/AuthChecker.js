const { verify } = require("../Util/JWT")
const allowedURL = [
  "POST /user/login",
  "POST /user/register",
  "GET /image",
  "GET /donation_program",
]
const AuthChecker = function (req, res, next) {
  let url = `${req.method} ${req.path}`
  if (new RegExp(allowedURL.join("|")).test(url)) {
    next()
  } else {
    verify(req, res, next)
  }
}

module.exports = AuthChecker
