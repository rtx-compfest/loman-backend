const { db } = require("../Database")

class WalletService {
  constructor() {
    const date = new Date()
    this.now = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
  }

  async getAll() {
    try {
      return db.historyTransaction.all()
    } catch (e) {
      return null
    }
  }

  async getRequest() {
    try {
      return db.historyTransaction.findAll({ status_transaction: 1 })
    } catch (e) {
      return null
    }
  }

  async getWithdrawByUser(userId) {
    try {
      return db.historyTransaction.findAll({ user_id: userId })
    } catch (error) {
      return null
    }
  }

  async getWithdrawByDonationProgram(programId) {
    try {
      return db.historyTransaction.findAll({ donation_id: programId })
    } catch (error) {
      return null
    }
  }

  async topUp(id, data) {
    const body = {
      transaction_date: this.now,
      debit: data.amount,
      credit: 0,
      user_id: id,
      donation_id: null,
      notes: data.notes,
      status_transaction: 1,
    }
    try {
      return await db.historyTransaction.add(body)
    } catch (e) {
      return null
    }
  }

  async donate(id, donation_id, data) {
    const { user_id } = await db.donationProgram.find(donation_id)
    const body = {
      transaction_date: this.now,
      debit: 0,
      credit: data.amount,
      user_id: id,
      donation_id: donation_id,
      notes: data.notes,
      status_transaction: 1,
    }
    const bodyData = {
      transaction_date: this.now,
      debit: data.amount,
      credit: 0,
      user_id: user_id,
      donation_id: donation_id,
      notes: data.notes,
      status_transaction: 1,
    }
    try {
      const { id } = await db.historyTransaction.add(bodyData)
      data = await db.historyTransaction.add(body)
      data.credit_id = data.id
      data.debit_id = id
      return data
    } catch (e) {
      return null
    }
  }

  async withdraw(id, donation_id, data) {
    const body = {
      transaction_date: this.now,
      credit: data.amount,
      debit: 0,
      user_id: id,
      donation_id: donation_id,
      notes: data.notes,
      status_transaction: 0,
    }
    try {
      const { amount } = await db.donationProgram.find(donation_id)
      if (amount < data.amount) return { limitAmount: true }
      return await db.historyTransaction.add(body)
    } catch (e) {
      return null
    }
  }

  async getWithdrawRequest(status) {
    try {
      return await db.historyTransaction.findByStatus(status)
    } catch (e) {
      return null
    }
  }

  async verify(id) {
    try {
      const { credit, donation_id } = await db.historyTransaction.find(id)
      const { amount } = await db.donationProgram.find(donation_id)
      if (credit > amount) return { limit: true }

      const body = {
        id: id,
        status_transaction: 1,
      }
      return await db.historyTransaction.update(body)
    } catch (error) {
      return null
    }
  }

  async reject(id) {
    try {
      const body = {
        id: id,
        status_transaction: 2,
      }
      return await db.historyTransaction.update(body)
    } catch (error) {
      return null
    }
  }
}

module.exports = WalletService
