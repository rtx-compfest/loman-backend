const { ErrorHandler } = require("../Util/ErrorHandler")

const AdminChecker = function (req, res, next) {
  if (req.user.role == "1") {
    next()
    return
  }
  return next(new ErrorHandler(401, "Account Not has Access"))
}

module.exports = AdminChecker
