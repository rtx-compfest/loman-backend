const FilterBody = require("../../Util/FilterBody")
const FilterUpdate = require("../../Util/FilterUpdate")
class DonationProgram {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
    this.tableName = "donation_program"
    this.viewName = "view_donation_program"
    this.allowedColumns = [
      "donation_name",
      "max_date",
      "expected_amount",
      "user_id",
      "donation_description",
      "photos",
      "donation_category",
      "recipient",
      "status",
    ]
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

  async find(id) {
    return this.db.one("select * from ${tableName:name} WHERE id=${id}", {
      tableName: this.viewName,
      id: id,
    })
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

  async findByFundanaiser(id, nama = "", orderBy = "id", sort = "ASC") {
    return this.db.any(
      "SELECT * FROM ${tableName:name} where user_id = ${id} and donation_name ILIKE '%${nama:value}%' ORDER BY ${orderBy:name} " +
        sort,
      {
        nama: nama,
        id: id,
        tableName: this.viewName,
        orderBy: orderBy,
        sort: sort,
      }
    )
  }

  async findByNameAndCategory(
    category,
    nama = "",
    orderBy = "id",
    sort = "ASC"
  ) {
    if (category) {
      return this.db.any(
        "SELECT * FROM ${tableName:name} where donation_category = ${category} AND donation_name ILIKE '%${nama:value}%' ORDER BY ${orderBy:name} " +
          sort,
        {
          nama: nama,
          category: category,
          tableName: this.viewName,
          orderBy: orderBy,
          sort: sort,
        }
      )
    } else {
      return this.db.any(
        "SELECT * FROM ${tableName:name} where  donation_name ILIKE '%${nama:value}%' ORDER BY ${orderBy:name} " +
          sort,
        {
          nama: nama,
          tableName: this.viewName,
          orderBy: orderBy,
          sort: sort,
        }
      )
    }
  }

  async total() {
    return this.db.one(
      "SELECT count(*) FROM " + this.tableName,
      [],
      (a) => +a.count
    )
  }
}

module.exports = DonationProgram
