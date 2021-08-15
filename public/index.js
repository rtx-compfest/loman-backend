const app = require("../App/App")
require("dotenv").config()
const port = process.env.PORT || 1000
const server = app.listen(port, async () => {
  console.log(`REST at http://localhost:${port}`)
})

module.exports = {
  app: app,
  server: server,
}
