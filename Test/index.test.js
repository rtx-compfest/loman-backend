const { db } = require("../Database")
const { app, server } = require("../public")
const LoginHelper = require("./helper/LoginHelper")
let request = require("supertest").agent(app)

describe("Some test", () => {
  test("It should response the GET method", (done) => {
    request.get("/").then((response) => {
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

afterAll(async () => {
  await server.close()
})
