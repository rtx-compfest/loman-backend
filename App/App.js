const express = require("express")
const app = express()
const cmpression = require("compression")
const path = require("path")
const { AuthChecker } = require("../Middleware")
const Route = require("../Routes/Routes")
const Cors = require("cors")
const timeout = require("connect-timeout")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const { handleError } = require("../Util/ErrorHandler")
const session = require("express-session")

//Timeout

app.use(timeout("60s"))
app.use(cmpression())

app.use(Cors({ origin: true, credentials: true }))

app.set("trust proxy", 1)
app.use(
  session({
    secret: process.env.SESS_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
    },
  })
)

//add log
app.use(morgan("tiny"))
app.use(cookieParser(process.env.JWT_KEY))

//Body Parser
app.use(express.json({ limit: "50mb" }))
app.use(
  express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 50000 })
)

// Read Upload file like image
app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.static(path.join(__dirname, "..", "public", "uploads")))

// JWT Auth Middleware
app.use(AuthChecker)

//Routing
Route(app)

//Handler error
app.use(handleError)

module.exports = app
