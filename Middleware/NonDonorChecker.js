const { ErrorHandler } = require("../Util/ErrorHandler")

const NonDonorChecker = function (req, res, next) {
  if (req.user.role == "1" || req.user.role == "3") {
    next()
    return
  }
  return next(new ErrorHandler(401, "Account Not has Access"))
}

module.exports = NonDonorChecker
