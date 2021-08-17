const { db } = require("../../Database")
const setCookie = require("set-cookie-parser")
class LoginHelper {
  ROLES = ["ADMIN", "DONOR", "FUNDRAISER"]
  constructor(request, ROLE = "ADMIN") {
    this.request = request
    this.token = ""
    if (this.ROLES.indexOf(ROLE) < 0) {
      ROLE = "ADMIN"
    }
    this.dataSample = {
      email: `sample@${ROLE}.com`,
      password: "sample123",
      name: "sample",
      address: "Indonesia",
      phone: "0888888",
      job: "Anonim",
      institution: "Anonim",
      about: "Anonim",
      socialmedia: "Anomin",
      user_roles: this.ROLES.indexOf(ROLE) + 1,
    }
  }

  initAccount(token) {
    this.request
      .post("/user/register")
      .send(this.dataSample)
      .then((res) => {
        this.id_user = res.body.data.id
        this.login(token)
      })
      .catch((err) => {
        token("token=")
      })
  }

  login(token) {
    this.request
      .post("/user/login")
      .send(this.dataSample)
      .end((err, res) => {
        let cookies = setCookie.parse(res, {
          decodeValues: true,
        })
        if (err) return token("token=")
        token("token=" + cookies[0].value + ";")
      })
  }

  removeTestAccount(done, cookies) {
    if (!this.id_user) return done()
    this.request
      .delete(`/user/${this.id_user}`)
      .set("Cookie", cookies)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  }
}

module.exports = LoginHelper
