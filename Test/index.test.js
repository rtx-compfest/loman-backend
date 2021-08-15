const { db } = require("../Database")
const app = require("../public")
const LoginHelper = require("./helper/LoginHelper")
// const LoginHelper = require("./helper/LoginHelper")
let request = require("supertest").agent(app)
const dataSample = {
  email: "sample@email.com",
  password: "sample",
  name: "sample",
  address: "Indonesia",
  phone: "0888888",
  job: "Anonim",
  institution: "Anonim",
  about: "Anonim",
  socialmedia: "Anomin",
  user_roles: 1,
}

let header = []

describe("Login", () => {
  test("It should response the GET method", (done) => {
    request
      .post("/user/login")
      .send(dataSample)
      .then((response) => {
        header = response.header
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})
describe("Some test", () => {
  test("It should response the GET method", (done) => {
    request
      .get("/")
      .set("Cookie", [...header["set-cookie"]])
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

// afterEach(async () => {
//   await db.none("DROP TABLE IF EXISTS pg_temp.temp_users")
// })

// describe("Test the root path", () => {
//   test("It should response the GET method", async (done) => {
//     const loginHelper = new LoginHelper(app, request)
//     await loginHelper.login()

//     loginHelper.request.get("/").then((response) => {
//       expect(response.statusCode).toBe(200)
//       done()
//     })
//   })
// })

/**
 * `../server` should point to your main server bootstrap file,
 * which has your express app exported. For example:
 *
 * var app = express();
 * module.exports = app;
 */

// afterAll(async () => {
//   await server.close()
// })
