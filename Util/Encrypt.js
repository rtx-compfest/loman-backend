const crypto = require("crypto")
require("dotenv").config()
const key = process.env.PUBLIC_KEY_ENCRYPT
const iva = Buffer.from(process.env.PRIVATE_KEY_ENCRYPT, "hex")

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iva)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString("hex")
}

module.exports = {
  encrypt: encrypt,
}
