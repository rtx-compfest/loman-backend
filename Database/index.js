const promise = require("bluebird")
const pgPromise = require("pg-promise")
const {
  UserRoles,
  Users,
  DonationProgram,
  DonationCategory,
  HistoryTransaction,
} = require("./Repository")

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

const connectionString =
  "postgres://cguirnsrgetxsr:a20e4429136a72fb84d59faa7fb855e45fef0a4c1f0e898a053b1c2961264878@ec2-34-194-14-176.compute-1.amazonaws.com:5432/d9sajc2rtcnm51"

const config = {
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
}

const db = pgp(config)

module.exports = { db, pgp }
