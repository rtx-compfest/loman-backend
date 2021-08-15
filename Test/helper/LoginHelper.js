const { db } = require("../../Database")
const TableTempHelper = require("./TableTempHelper")

class LoginHelper {
  ROLES = ["ADMIN", "DONOR", "FUNDRAISER"]
  constructor(app, request, ROLE = "ADMIN") {
    this.app = app
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
    let tableHelper = new TableTempHelper(db)
    tableHelper.createTableTemp()
  }

  register() {
    return this.request.post("/user/register").send(this.dataSample)
  }

  login() {
    return this.request.post("/user/login").send(this.dataSample)
  }
}

module.exports = LoginHelper
