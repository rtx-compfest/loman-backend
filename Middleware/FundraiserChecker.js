const { ErrorHandler } = require("../Util/ErrorHandler")
const FundraiserChecker = function (req, res, next) {
  if (req.user.role == "3") {
    next()
    return
  }
  return next(new ErrorHandler(401, "Account Not has Access"))
}

module.exports = FundraiserChecker
