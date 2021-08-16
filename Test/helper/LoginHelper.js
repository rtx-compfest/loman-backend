const { db } = require("../../Database")
const setCookie = require("set-cookie-parser")
class LoginHelper {
  ROLES = ["ADMIN", "DONOR", "FUNDRAISER"]
  constructor(request, ROLE = "ADMIN") {
    this.request = request
    if (this.ROLES.indexOf(ROLE) < 0) {
      ROLE = "ADMIN"
    }
    this.dataSample = {
      email: "sample@email.com",
      password: "sample",
      name: "sample",
      address: "Indonesia",
      phone: "0888888",
      job: "Anonim",
      institution: "Anonim",
      about: "Anonim",
      socialmedia: "Anomin",
      user_roles: this.ROLES.indexOf(ROLE) + 1,
    }
    // let tableHelper = new TableTempHelper(db)
    // tableHelper.createTableTemp()
  }

  initAccount(token) {
    this.login(token)
    return
    this.request
      .post("/user/register")
      .send(this.dataSample)
      .end((err, res) => {
        this.id_user = res.body.id
        if (error) return token("token=")
        this.login(token)
      })
  }

  login(token) {
    this.request
      .post("/user/login")
      .send(this.dataSample)
      .end((err, res) => {
        let cookies = setCookie.parse(res, {
          decodeValues: true, // default: true
        })
        cookies = "token=" + cookies[0].value + ";"
        if (err) return token("token=")
        token(cookies)
      })
  }

  removeTestAccount() {}
}

module.exports = LoginHelper
