const app = require("../App/App")
const { db } = require("../Database")
require("dotenv").config()
const port = process.env.PORT || 1000

app.listen(port, async () => {
  // console.log(`REST at http://localhost:${port}`)
})

module.exports = app
