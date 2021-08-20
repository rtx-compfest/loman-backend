const { db } = require("../Database")
const { generate } = require("../Util/JWT")

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
      const dataUser = await db.users.findValue(data)
      const token = generate(dataUser)
      return {
        data: {
          name: dataUser["name"],
          email: dataUser["email"],
          status_user: dataUser["status_user"],
          user_roles: dataUser["user_roles"],
        },
        token: token,
      }
    } catch (e) {
      return null
    }
  }
  async register(data) {
    try {
      const dataFound = await db.users.findByEmail(data.email)
      if(!dataFound){
        const { email, status_user, id } = await db.users.add(data)
        return {
          email,
          status_user,
          id,
        }
      }
    } catch (e) {
      return null
    }
  }
  async update(id, data) {
    data.id = id
    try {
      return await db.users.update(data)
    } catch (e) {
      return null
    }
  }

  async remove(id) {
    try {
      const data = await db.users.remove(id)
      return data
    } catch (e) {
      return null
    }
  }

  async verify(id) {
    try {
      return await db.users.update({
        id: id,
        status_user: "1",
      })
    } catch {
      return null
    }
  }

  async reject(id) {
    try {
      return await db.users.update({
        id: id,
        status_user: "2",
      })
    } catch {
      return null
    }
  }
}

module.exports = UserService
