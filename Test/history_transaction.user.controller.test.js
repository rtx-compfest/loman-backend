const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
const agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent, "FUNDRAISER")
const loginUser = new LoginHelper(agent, "DONOR")
const fs = require("fs")

let tokenFundraiser
let tokenDonor

let idTempDonation = ""
let idTempTransaction = []
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
      tokenFundraiser = token
      loginUser.initAccount((token) => {
        tokenDonor = token
        done()
      })
    })
  })

  it("should can post donation program", async () => {
    const res = await agent
      .post("/donation_program")
      .set("Authorization", tokenFundraiser)
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

  it("should can topup", async () => {
    const res = await agent
      .post("/wallet/topup/")
      .set("Authorization", tokenDonor)
      .send(body)
    idTempTransaction.push(res.body.data.id)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can amount user is increase", async () => {
    const res = await agent
      .get(`/user/${loginUser.id_user}`)
      .set("Authorization", tokenDonor)

    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.body.data.amount).equal(body.amount)
    expect(res.status).to.equal(200)
  })

  it("should can donate program", async () => {
    const res = await agent
      .post("/wallet/donate/" + idTempDonation)
      .set("Authorization", tokenDonor)
      .send(body)

    idTempTransaction.push(res.body.data.credit_id)
    idTempTransaction.push(res.body.data.debit_id)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can amount user is descrease", async () => {
    const res = await agent
      .get(`/user/${loginUser.id_user}`)
      .set("Authorization", tokenDonor)

    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.body.data.amount).equal(0)
    expect(res.status).to.equal(200)
  })

  it("should can amount donation program is increase", async () => {
    const res = await agent
      .get(`/donation_program/${idTempDonation}`)
      .set("Authorization", tokenDonor)
    await idTempTransaction.forEach(async (id) => {
      const data = await db.historyTransaction.remove(id)
    })
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.body.data.amount).equal(0)
    expect(res.status).to.equal(200)
  })

  it("should cannot donate program cause amount is unfficient", async () => {
    const res = await agent
      .post("/wallet/donate/" + idTempDonation)
      .set("Authorization", tokenDonor)
      .send(body)
    expect(res.body).to.have.property("status")
    expect(res.status).to.equal(404)
  })

  it("should can delete donation program ", async () => {
    const res = await agent
      .delete(`/donation_program/${idTempDonation}`)
      .set("Authorization", tokenFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(() => {
      loginUser.removeTestAccount(done, tokenFundraiser)
    }, tokenFundraiser)
  })
})
