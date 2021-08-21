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
  // if (url.length > 1) {
  //   if (
  //     (url[1] == "image") |
  //     ((url[1] === "user") & ((url[2] === "login") | (url[2] === "register")))
  //   ) {
  //     next()
  //   } else {
  //     verify(req, res, next)
  //   }
  // } else {
  //   verify(req, res, next)
  // }
}

module.exports = AuthChecker
