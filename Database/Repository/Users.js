const { encrypt } = require("../../Util/Encrypt")
const FilterBody = require("../../Util/FilterBody")
const FilterUpdate = require("../../Util/FilterUpdate")
class Users {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
    this.tableName = "users"
    this.viewName = "view_users"
    this.allowedColumns = [
      "name",
      "email",
      "password",
      "address",
      "phone",
      "status_user",
      "user_roles",
      "job",
      "institution",
      "about",
      "socialmedia",
    ]
  }

  // Registration
  async add(values) {
    values = FilterBody(values, this.allowedColumns)
    values["password"] = encrypt(values["password"])
    if (values["user_roles"] === 2) {
      values["status_user"] = 1
    } else if (values["user_roles"] === 3) {
      values["status_user"] = 0
    }
    for (let key in values) {
      if (values[key] === null) {
        return null
      }
    }

    return this.db.one(
      "INSERT INTO public." +
        this.tableName +
        "(${this:name}) VALUES (${this:csv}) RETURNING *;",
      values
    )
  }

  async update(values) {
    let body = new FilterUpdate(values, this.pgp, this.allowedColumns)

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

  // Login
  async find(values) {
    return this.db.oneOrNone(
      "select * from ${tableName:name} WHERE email=${email} AND password=${password}",
      {
        tableName: this.tableName,
        email: values.email,
        password: encrypt(values.password),
      }
    )
  }

  async find(id) {
    return this.db.any("select * from ${tableName:name} WHERE id=${id}", {
      tableName: this.viewName,
      id: id,
    })
  }

  async findByRole(role, status = "0", orderBy = "id", sort = "ASC") {
    return this.db.any(
      "SELECT * FROM ${tableName:name} where idrole = '${role:value}' and status_user  = '${status:value}' ORDER BY ${orderBy:name} " +
        sort,
      {
        status: status,
        role: role,
        tableName: this.viewName,
        orderBy: orderBy,
        sort: sort,
      }
    )
  }

  async all(orderBy = "id", sort = "ASC") {
    return this.db.any(
      "SELECT * FROM ${tableName:name} ORDER BY ${orderBy:name} " + sort,
      {
        tableName: this.viewName,
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

module.exports = Users
