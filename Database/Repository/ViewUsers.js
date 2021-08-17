const FilterBody = require("../../Util/FilterBody")
const FilterUpdate = require("../../Util/FilterUpdate")
class ViewUsers {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
    this.tableName = "view_users"
  }

  async find(id) {
    return this.db.one("select * from ${tableName:name} WHERE id=${id}", {
      tableName: this.tableName,
      id: id,
    })
  }

  async all(orderBy = "id", sort = "ASC") {
    return this.db.any(
      "SELECT * FROM ${tableName:name} ORDER BY ${orderBy:name} " + sort,
      {
        tableName: this.tableName,
        orderBy: orderBy,
        sort: sort,
      }
    )
  }

  async total() {
    return this.db.one(
      "SELECT count(*) FROM " + this.tableName,
      [],
      (a) => +a.count
    )
  }
}

module.exports = ViewUsers
