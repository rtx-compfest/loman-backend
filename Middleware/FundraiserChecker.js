const FundraiserChecker = function (req, res, next) {
  if (req.user.role === "2") {
    next()
  }
}

module.exports = FundraiserChecker
