const { verify } = require("../Util/JWT");
const Middleware = function (req, res, next) {
  let url = req.path.split("/");
  if (url.length > 1) {
    if (url[1] == "auth") {
      next();
    } else {
      verify(req, res, next);
    }
  } else {
    verify(req, res, next);
  }
};

module.exports = Middleware;
