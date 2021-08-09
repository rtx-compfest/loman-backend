const express = require("express")
const app = express()
const cmpression = require("compression")
var path = require("path")
const Middleware = require("../Middleware/Middleware")
const Route = require("../Routes/Routes")
const Cors = require("cors")
const { handleError } = require("../Util/ErrorHandler")

app.use(cmpression())
app.use(Cors())

//Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.static(path.join(__dirname, "..", "public", "uploads")))

//JWT Middleware
//app.use(Middleware);

//Routing
Route(app)

//Error Handling
app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app
