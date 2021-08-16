const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
const loginHelper = new LoginHelper(chai.request(server))

let cookies
const subUrl = "/donation_category"
describe("Donation category Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      cookies = token
      done()
    })
  })

  it("should can show donation category", async () => {
    const res = await chai.request(server).get(subUrl).set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show donation category selected", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/1`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })
})
