const promise = require("bluebird")
const pgPromise = require("pg-promise")
const {
  UserRoles,
  Users,
  DonationProgram,
  DonationCategory,
  HistoryTransaction,
} = require("./Repository")
require("dotenv").config()

const initOptions = {
  promiseLib: promise,

  extend(obj) {
    obj.userRoles = new UserRoles(obj, pgp)
    obj.users = new Users(obj, pgp)
    obj.donationProgram = new DonationProgram(obj, pgp)
    obj.donationCategory = new DonationCategory(obj, pgp)
    obj.historyTransaction = new HistoryTransaction(obj, pgp)
  },
}
// Initializing the library:
const pgp = pgPromise(initOptions)
const connectionString = process.env.CONNECTION_STRING || ""
const config = {
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
}

const db = pgp(config)

module.exports = { db, pgp }
