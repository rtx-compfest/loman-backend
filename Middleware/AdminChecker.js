const AdminChecker = function (req, res, next) {
  if (req.user.role === "1") {
    next()
  }
}

module.exports = AdminChecker
