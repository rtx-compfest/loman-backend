const FilterBody = require("../../Util/FilterBody")
const FilterUpdate = require("../../Util/FilterUpdate")
class UserRoles {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
    this.tableName = "user_roles"
    this.allowedColumns = ["user_roles"]
  }

  async add(values) {
    values = FilterBody(values, this.allowedColumns)
    return this.db.one(
      "INSERT INTO public." +
        this.tableName +
        "(${this:name}) VALUES (${this:csv}) RETURNING *;",
      values
    )
  }

  async update(values) {
    const body = new FilterUpdate(values, this.pgp, this.allowedColumns)
    return this.db.one("UPDATE public.$1:name set $2 WHERE id=$3 RETURNING *", [
      this.tableName,
      body,
      values.id,
    ])
  }

  async remove(id) {
    return this.db.one("DELETE FROM $1:name WHERE id = $2 RETURNING * ", [
      this.tableName,
      id,
    ])
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

module.exports = UserRoles
