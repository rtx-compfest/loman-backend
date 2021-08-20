const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../public")
const LoginHelper = require("./helper/LoginHelper")
const expect = chai.expect

chai.use(chaiHttp)
const agent = chai.request.agent(server)
const loginHelper = new LoginHelper(agent, "ADMIN")
const loginFundraiser = new LoginHelper(agent, "FUNDRAISER")
const fs = require("fs")

let tokenAdmin
let tokenFundraiser

let idTempDonation = ""
let idTempTransaction = ""

const path = require("path")
const { db } = require("../Database")
const tempFile = fs.readFileSync(
  path.resolve(__dirname + `/helper/image/test_image.png`)
)

describe("History Trasaction Fundraiser Controller", () => {
  before(function (done) {
    loginHelper.initAccount((token) => {
      tokenAdmin = token
      loginFundraiser.initAccount((token) => {
        tokenFundraiser = token
        done()
      })
    })
  })

  it("should can post donation program", async () => {
    const res = await agent
      .post(`/donation_program`)
      .set("Authorization", tokenFundraiser)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("donation_name", "Test Donation")
      .field("max_date", "2021-09-01")
      .field("expected_amount", "10000")
      .field("user_id", loginFundraiser.id_user)
      .field("donation_description", "TEST")
      .field("recipient", "Test")
      .attach("photos", tempFile, "preview.png")
    idTempDonation = res.body.data.id
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can withdraw donation program ", async () => {
    const dataWithdraw = {
      amount: 0,
      notes: "-",
      isVisible: 1,
    }
    const res = await agent
      .post(`/wallet/withdraw/${idTempDonation}`)
      .send(dataWithdraw)
      .set("Authorization", tokenFundraiser)
    idTempTransaction = res.body.data.id
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can verify donation program ", async () => {
    const res = await agent
      .post(`/wallet/verify/${idTempTransaction}`)
      .set("Authorization", tokenAdmin)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can reject donation program ", async () => {
    const res = await agent
      .post(`/wallet/reject/${idTempTransaction}`)
      .set("Authorization", tokenAdmin)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  it("should can delete donation program ", async () => {
    await db.historyTransaction.remove(idTempTransaction)
    const res = await agent
      .delete(`/donation_program/${idTempDonation}`)
      .set("Authorization", tokenFundraiser)
    expect(res.body).to.have.property("data")
    expect(res.body.data).to.be.an("object")
    expect(res.status).to.equal(200)
  })

  after(function (done) {
    loginHelper.removeTestAccount(() => {
      loginFundraiser.removeTestAccount(done, tokenAdmin)
    }, tokenAdmin)
  })
})
