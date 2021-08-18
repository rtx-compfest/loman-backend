const { db } = require("../Database")

//Sort Test
require("./auth.checker.test")
require("./donation_category.controller.test")
require("./donation_program.controller.test")
require("./user.controller.test")
require("./history_transaction.fundraiser.controller.test")
require("./history_transaction.user.controller.test")

//Reset all id temp
const tables = ["donation_program", "history_transaction", "users"]

tables.forEach(async (table) => {
  await db.none(
    `SELECT pg_catalog.setval(pg_get_serial_sequence('${table}', 'id'), MAX(id)) FROM ${table};`
  )
})
