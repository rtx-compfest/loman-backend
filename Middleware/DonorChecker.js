const { ErrorHandler } = require("../Util/ErrorHandler")
const DonorChecker = function (req, res, next) {
  if (req.user.role == "2") {
    next()
    return
  }
  next(new ErrorHandler(401, "Not has Access"))
}

module.exports = DonorChecker
