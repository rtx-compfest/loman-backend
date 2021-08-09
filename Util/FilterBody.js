const FilterBody = (raw, allowed) => {
  return Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key]
      return obj
    }, {})
}

module.exports = FilterBody
