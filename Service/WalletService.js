const { db } = require("../Database")

class WalletService {
  constructor() {
    const date = new Date()
    this.now = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
  }

  async topUp(id, data) {
    const body = {
      transaction_date: this.now,
      debit: data.amount,
      credit: 0,
      user_id: id,
      donation_id: null,
      notes: data.notes,
    }
    try {
      return await db.historyTransaction.add(body)
    } catch (e) {
      return null
    }
  }

  async donate(id, donation_id, data) {
    const body = {
      transaction_date: this.now,
      debit: data.amount,
      credit: 0,
      user_id: id,
      donation_id: donation_id,
      notes: data.notes,
    }
    try {
      return await db.historyTransaction.add(body)
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
