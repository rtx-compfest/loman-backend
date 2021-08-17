const { body } = require("express-validator")
const { db } = require("../Database")

function validate() {
  return [
    body("email").isEmail().withMessage("Email is invalid"),
    body("email").custom(checkEmail),
    body("user_roles").notEmpty().withMessage("Role is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password is not strong. Min length : 8"),
  ]
}

async function checkEmail(email, { req }) {
  let sql
  if (req.params.id) {
    sql =
      "select email from users where email = $1 and id !='" +
      req.params.id +
      "'"
  } else {
    sql = "select email from users where email = $1"
  }
  let res = await db.query(sql, [email])
  return new Promise((resolve, reject) => {
    if (res.length > 0) {
      reject("Email is exists")
    }
    resolve()
  })
}

module.exports = validate
