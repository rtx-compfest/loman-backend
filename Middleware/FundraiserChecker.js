const { ErrorHandler } = require("../Util/ErrorHandler")
const FundraiserChecker = function (req, res, next) {
  if (req.user.role == "3") {
    next()
    return
  }
  next(new ErrorHandler(401, "Not has Access"))
}

module.exports = FundraiserChecker
