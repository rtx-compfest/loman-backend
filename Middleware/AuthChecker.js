const { verify } = require("../Util/JWT")
const AuthChecker = function (req, res, next) {
  let url = req.path.split("/")
  if (url.length > 1) {
    if (
      (url[1] == "image") |
      ((url[1] === "user") & ((url[2] === "login") | (url[2] === "register")))
    ) {
      next()
    } else {
      verify(req, res, next)
    }
  } else {
    verify(req, res, next)
  }
}

module.exports = AuthChecker
