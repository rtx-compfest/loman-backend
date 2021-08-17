const { ErrorHandler } = require("../Util/ErrorHandler")

const AdminChecker = function (req, res, next) {
  if (req.user.role == "1") {
    next()
    return
  }
  next(new ErrorHandler(401, "Not has Access"))
}

module.exports = AdminChecker
