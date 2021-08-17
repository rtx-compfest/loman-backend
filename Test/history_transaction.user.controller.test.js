const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
var agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent, "FUNDRAISER")
const loginUser = new LoginHelper(agent, "DONOR")
const fs = require("fs")

let cookies
let cookiesDonor

let idTempDonation = ""
const subUrl = "/donation_program"
const path = require("path")
const { db } = require("../Database")
const tempFile = fs.readFileSync(
  path.resolve(__dirname + `/helper/image/test_image.png`)
)
const body = {
  amount: 1000,
  notes: "-",
  isVisible: 1,
}
describe("History Trasaction Donor Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      cookies = token
      loginUser.initAccount((token) => {
        cookiesDonor = token
        done()
      })
    })
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
    idTempDonation = res.body.data.id
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can donate program", async () => {
    const res = await agent
      .post("/wallet/donate/" + idTempDonation)
      .set("Cookie", cookiesDonor)
      .send(body)
    await db.historyTransaction.remove(res.body.data.id)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can topup", async () => {
    const res = await agent
      .post("/wallet/topup/")
      .set("Cookie", cookiesDonor)
      .send(body)
    await db.historyTransaction.remove(res.body.data.id)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can delete donation program ", async () => {
    const res = await agent
      .delete(`${subUrl}/${idTempDonation}`)
      .set("Cookie", cookies)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(() => {
      loginUser.removeTestAccount(done, cookies)
    }, cookies)
  })
})
