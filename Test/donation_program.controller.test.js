const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
var agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent, "FUNDRAISER")
const fs = require("fs")
let cookies
let idTemp = ""
const subUrl = "/donation_program"
const path = require("path")
const tempFile = fs.readFileSync(
  path.resolve(__dirname + `\\helper\\image\\test_image.png`)
)

describe("Donation program Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      cookies = token
      done()
    })
  })

  it("should can show donation program", async () => {
    const res = await agent.get(subUrl).set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can post donation program", async () => {
    const res = await agent
      .post(subUrl)
      .set("Cookie", cookies)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("donation_name", "Test Donation")
      .field("max_date", "2021-09-01")
      .field("expected_amount", "10000")
      .field("user_id", loginHelper.id_user)
      .field("donation_description", "TEST")
      .field("recipient", "Test")
      .attach("photos", tempFile, "preview.png")
    idTemp = res.body.data.id
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can update donation program", async () => {
    const res = await agent
      .post(`${subUrl}/${idTemp}`)
      .set("Cookie", cookies)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("donation_name", "Test Donation Updated")
      .field("max_date", "2021-09-01")
      .field("expected_amount", "10000")
      .field("donation_description", "TEST")
      .field("recipient", "Test")
      .attach("photos", tempFile, "preview.png")
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can update donation program without image", async () => {
    const res = await agent
      .post(`${subUrl}/${idTemp}`)
      .set("Cookie", cookies)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("donation_name", "Test Donation Updated")
      .field("max_date", "2021-09-01")
      .field("expected_amount", "10000")
      .field("donation_description", "TEST")
      .field("recipient", "Test")

    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can show donation program selected not found", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/0`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("status")
    expect(res.body.status).to.equal(false)
    expect(res.status).to.equal(404)
  })

  it("should can show donation program selected found", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/${idTemp}`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.body.status).to.equal(true)
    expect(res.status).to.equal(200)
  })

  it("should can delete donation program ", async () => {
    const res = await agent.delete(`${subUrl}/${idTemp}`).set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can show donation program by fundraiser", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/fundraiser/0`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  it("should can show donation program by donor", async () => {
    const res = await chai
      .request(server)
      .get(`${subUrl}/donor/0`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("array")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(done, cookies)
  })
})
