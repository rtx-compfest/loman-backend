const FilterBody = require("./FilterBody")

class FilterUpdate {
  constructor(filters, pgp, filterColumns = []) {
    if (!pgp || !filters || typeof filters !== "object") {
      throw new TypeError("Parameter 'filters' must be an object.")
    }
    this.pgp = pgp
    this.filters = FilterBody(filters, filterColumns)
    this.rawType = true // do not escape the result from toPostgres()
  }

  toPostgres() {
    const keys = Object.keys(this.filters)
    const s = keys
      .map((k) => this.pgp.as.name(k) + " = ${" + k + "}")
      .join(" , ")
    return this.pgp.as.format(s, this.filters)
  }
}
module.exports = FilterUpdate
