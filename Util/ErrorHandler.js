class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}
const handleError = (err, req, res, next) => {
  console.log(err)
  const { statusCode, message } = err
  res.status(statusCode).json({
    status: false,
    message,
  })
}

module.exports = {
  ErrorHandler,
  handleError,
}
