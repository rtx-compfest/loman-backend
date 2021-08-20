const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
const agent = chai.request.agent(server)
const loginFundraiser = new LoginHelper(agent, "FUNDRAISER")
const loginAdmin = new LoginHelper(agent)

let cookiesFundraiser, cookiesAdmin
const subUrl = "/user"
describe("User Controller", () => {
  before(function (done) {
    loginFundraiser.initAccount((token) => {
      cookiesFundraiser = token
      loginAdmin.initAccount((token) => {
        cookiesAdmin = token
        done()
      })
    })
  })

  it("should can not login wrong password", async () => {
    const res = await agent
      .post(subUrl + "/login")
      .send({ email: "fake@email.com", password: "fake1234" })

    expect(res.status).to.equal(404)
  })

  it("should can not register same email", async () => {
    const res = await agent
      .post(subUrl + "/register")
      .send(loginFundraiser.dataSample)
    expect(res.body).to.have.property("status")
    expect(res.status).to.equal(406)
  })

  it("should can show users", async () => {
    const res = await agent.get(subUrl).set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show donor", async () => {
    const res = await agent
      .get(`${subUrl}/donor`)
      .set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser not validated", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=0`)
      .set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser  validated", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=1`)
      .set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show fundraiser rejected", async () => {
    const res = await agent
      .get(`${subUrl}/fundraiser?status=2`)
      .set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show user selected", async () => {
    const res = await agent
      .get(`${subUrl}/` + loginFundraiser.id_user)
      .set("Authorization", cookiesFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can verify fundraiser ", async () => {
    const res = await agent
      .post(`${subUrl}/verify/${loginFundraiser.id_user}`)
      .set("Authorization", cookiesAdmin)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can reject fundraiser ", async () => {
    const res = await agent
      .post(`${subUrl}/reject/${loginFundraiser.id_user}`)
      .set("Authorization", cookiesAdmin)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginFundraiser.removeTestAccount(() => {
      loginAdmin.removeTestAccount(done, cookiesFundraiser)
    }, cookiesFundraiser)
  })
})
