const jwt = require("jsonwebtoken");
var key = "85838781494488976149270763900171";

function generate(username) {
  return jwt.sign({ username: username, project: "Kopiin" }, key);
}

function verify(req, res, next) {
  try {
    let token = req.headers.authorization;
    var decoded = jwt.verify(token, key);
    if (decoded.project == "Kopiin") {
      next();
    } else {
      res.status(401).json({ status: false, message: "Token is not valid" });
    }
  } catch (err) {
    res.status(401).json({ status: false, message: "Token is not valid" });
  }
}

module.exports = {
  generate: generate,
  verify: verify,
};
