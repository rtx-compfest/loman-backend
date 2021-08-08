const express = require("express")
const app = express()
const cmpression = require("compression")
var path = require("path")
app.use(cmpression())
const Middleware = require("../Middleware/Middleware")
const Route = require("../Routes/Routes")
const Cors = require("cors")
const { encrypt, decrypt } = require("../Util/Encrypt")
require("dotenv").config()
//CORS
var whitelist = [
  "https://webdokter.herokuapp.com",
  "http://localhost:3000",
  "https://api-dokter.herokuapp.com",
]

app.use(Cors())

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "https://webdokter.herokuapp.com"
  // );
  const origin = req.headers.origin
  if (whitelist.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true)

  // Pass to next layer of middleware
  next()
})

//Make body readable

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "..", "public")))

//Add middleware
// app.use(Middleware);

app.use(express.static(path.join(__dirname, "..", "public", "uploads")))
//Add Routes
Route(app)

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "..", "public", "uploads"))
})

module.exports = app
