const FundraiserChecker = function (req, res, next) {
  if (req.user.role == "3") {
    next()
  }
}

module.exports = FundraiserChecker
