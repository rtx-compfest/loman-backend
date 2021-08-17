const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
var agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent)

let cookies
const subUrl = "/user"
describe("User Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      cookies = token
      done()
    })
  })

  it("should can show users", async () => {
    const res = await agent.get(subUrl).set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show donor", async () => {
    const res = await agent.get(`${subUrl}/donor`).set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser not validated", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=0`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser  validated", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=1`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser rejected", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=2`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show user selected", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/${loginHelper.id_user}`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(done, cookies)
  })
})
