const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
const agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent)

let tokenUser
const subUrl = "/donation_category"
describe("Donation category Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      tokenUser = token
      done()
    })
  })

  it("should can show donation category", async () => {
    const res = await agent.get(subUrl).set("Authorization", tokenUser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show donation category selected", async () => {
    const res = await agent.get(`${subUrl}/1`).set("Authorization", tokenUser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(done, tokenUser)
  })
})
