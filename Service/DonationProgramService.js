const { db } = require("../Database")
const fs = require("fs")
const path = require("path")
class DonationProgramService {
  async getAll(query) {
    try {
      return await db.donationProgram.findByNameAndCategory(
        query.category,
        query.nama,
        query.orderBy,
        query.sort
      )
    } catch (e) {
      return null
    }
  }

  async getById(id) {
    try {
      let data = await db.donationProgram.find(id)
      data.donor = await db.donorDonation.findByDonationProgram(id)
      return data
    } catch (e) {
      return null
    }
  }

  async getByFundraiser(id, query) {
    try {
      return await db.donationProgram.findByFundanaiser(
        id,
        query.nama,
        query.orderBy,
        query.sort
      )
    } catch (e) {
      return null
    }
  }

  async getByUser(id) {
    try {
      return await db.donorDonation.findByUser(id)
    } catch (e) {
      return null
    }
  }

  async add(data) {
    data.status = 0

    try {
      return await db.donationProgram.add(data)
    } catch {
      return null
    }
  }

  async update(id, data) {
    data.id = id
    try {
      return await db.donationProgram.update(data)
    } catch {
      return null
    }
  }

  async remove(id) {
    try {
      let data = await db.donationProgram.remove(id)
      fs.unlinkSync(
        path.resolve(
          __dirname +
            `\\..\\public\\uploads\\image\\donation_program\\${data.photos}`
        )
      )
      return data
    } catch {
      return null
    }
  }
}

module.exports = DonationProgramService
