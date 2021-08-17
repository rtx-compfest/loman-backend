const { db } = require("../Database")

class UserService {
  async getAll() {
    try {
      return await db.users.all()
    } catch (e) {
      return null
    }
  }

  async getById(id) {
    try {
      return await db.users.find(id)
    } catch (e) {
      return null
    }
  }

  async getFundraiser(query) {
    try {
      return await db.users.findByRole(
        3,
        query.status,
        query.orderBy,
        query.sort
      )
    } catch (e) {
      return null
    }
  }

  async getDonor(query) {
    try {
      return await db.users.findByRole(2, 1, query.orderBy, query.sort)
    } catch (e) {
      return null
    }
  }

  async login(data) {
    try {
      return await db.users.findValue(data)
    } catch (e) {
      return null
    }
  }
  async register(data) {
    try {
      const result = await db.users.add(data)
      return {
        email: result["email"],
        status_user: result["status_user"],
        id: result["id"],
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }
  async update(id, data) {
    data.id = id
    try {
      return await db.users.update(data)
    } catch {
      return null
    }
  }

  async remove(id) {
    try {
      let data = await db.users.remove(id)
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

module.exports = UserService
