const { db } = require("../Database")

class DonationCategoryService {
  async getAll() {
    try {
      return await db.donationCategory.all()
    } catch (e) {
      return null
    }
  }

  async getById(id) {
    try {
      return await db.donationCategory.find(id)
    } catch (e) {
      return null
    }
  }
}

module.exports = DonationCategoryService
