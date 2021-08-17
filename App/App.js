const express = require("express")
const app = express()
const cmpression = require("compression")
var path = require("path")
const Middleware = require("../Middleware/Middleware")
const Route = require("../Routes/Routes")
const Cors = require("cors")
var timeout = require("connect-timeout")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const { handleError } = require("../Util/ErrorHandler")

//Timeout
app.use(timeout("10s"))

app.use(cmpression())
app.use(Cors())
app.use(morgan("tiny"))
app.use(cookieParser(process.env.JWT_KEY))

//Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.static(path.join(__dirname, "..", "public", "uploads")))

// JWT Middleware
app.use(Middleware)

//Routing
Route(app)
app.use(handleError)
module.exports = app
