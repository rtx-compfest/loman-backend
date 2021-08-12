class DonorDonation {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
    this.viewName = "view_detail_donor"
  }

  async findByDonationProgram(id) {
    return this.db.any(
      "select * from ${tableName:name} WHERE donation_id=${id}",
      {
        tableName: this.viewName,
        id: id,
      }
    )
  }

  async findByUser(id) {
    return this.db.any("select * from ${tableName:name} WHERE user_id=${id}", {
      tableName: this.viewName,
      id: id,
    })
  }

  async all(orderBy = "donation_name", sort = "ASC") {
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
      "SELECT count(*) FROM " + this.viewName,
      [],
      (a) => +a.count
    )
  }
}

module.exports = DonorDonation
