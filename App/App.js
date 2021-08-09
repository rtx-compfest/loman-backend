const express = require("express")
const app = express()
const cmpression = require("compression")
var path = require("path")
app.use(cmpression())
const Middleware = require("../Middleware/Middleware")
const Route = require("../Routes/Routes")
const Cors = require("cors")
const { handleError } = require("../Util/ErrorHandler")

app.use(Cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.static(path.join(__dirname, "..", "public", "uploads")))

Route(app)
//Error Handling
app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app
