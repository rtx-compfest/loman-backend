const { db } = require("../../Database")

class TableTempHelper {
  constructor() {
    this.tables = [
      "donation_category",
      "user_roles",
      "users",
      "donation_program",
      "history_transaction",
    ]
  }

  async createTableTemp() {
    await db.none(
      "CREATE TEMPORARY TABLE $1:name (LIKE $1:name INCLUDING ALL);",
      ["users"]
    )
  }

  dropTableTemp() {
    db.none("DISCARD TEMP;")
  }
}

module.exports = TableTempHelper
