const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
var agent = chai.request.agent(server)
const loginFundraiser = new LoginHelper(agent, "FUNDRAISER")
const loginAdmin = new LoginHelper(agent)

let cookiesFundraiser, cookiesAdmin

describe("Check Auth", () => {
  before(function (done) {
    loginFundraiser.initAccount((token) => {
      cookiesFundraiser = token
      loginAdmin.initAccount((token) => {
        cookiesAdmin = token
        done()
      })
    })
  })

  it("should cannot access donation category", async () => {
    const res = await agent.get("/donation_category")

    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should can access donation category", async () => {
    const res = await agent
      .get("/donation_category")
      .set("Cookie", cookiesAdmin)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(true)
    expect(res.status).to.equal(200)
  })

  it("should cannot post donation program", async () => {
    const res = await agent
      .post("/donation_program")
      .set("Cookie", cookiesAdmin)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access verify donation program", async () => {
    const res = await agent
      .post("/donation_program/verify/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access reject donation program", async () => {
    const res = await agent
      .post("/donation_program/reject/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access accept wd donation program program", async () => {
    const res = await agent
      .post("/wallet/verify/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access reject wd donation program program", async () => {
    const res = await agent
      .post("/wallet/reject/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access accept fundraiser proposal", async () => {
    const res = await agent
      .post("/user/verify/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  it("should cannot access reject fundraiser proposal", async () => {
    const res = await agent
      .post("/user/reject/0")
      .set("Cookie", cookiesFundraiser)
    expect(res.body).to.have.property("status")
    expect(res.body.status).equal(false)
    expect(res.status).to.equal(401)
  })

  after(function (done) {
    loginFundraiser.removeTestAccount(() => {
      loginAdmin.removeTestAccount(done, cookiesFundraiser)
    }, cookiesFundraiser)
  })
})
