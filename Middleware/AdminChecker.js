const AdminChecker = function (req, res, next) {
  if (req.user.role === "0") {
    next()
  }
}

module.exports = AdminChecker
