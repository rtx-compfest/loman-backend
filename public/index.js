const app = require("../App/App")
require("dotenv").config()
const port = process.env.PORT || 1000
//Listen
app.listen(port, async () => {})

module.exports = app
