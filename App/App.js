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

var session = require("express-session")
//Timeout
app.use(timeout("10s"))

app.use(cmpression())

// set cors
// app.use(
//   Cors({
//     origin: function (origin, callback) {
//       callback(null, true)
//     },

//     credentials: true,
//   })
// )

// app.use(
//   Cors({ origin: "*", credentials: true, exposedHeaders: ["set-cookie"] })
// )

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*")
  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "*")
  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*")
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true)

  // Pass to next layer of middleware
  next()
})

app.set("trust proxy", 1)
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // must be 'none' to enable cross-site delivery
      secure: true,
    },
  })
)

app.use(morgan("tiny"))
app.use(cookieParser(process.env.JWT_KEY))

//Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Read Upload file like image
app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.static(path.join(__dirname, "..", "public", "uploads")))

// JWT Middleware
app.use(Middleware)

//Routing
Route(app)

// app.use(handleError)
module.exports = app
