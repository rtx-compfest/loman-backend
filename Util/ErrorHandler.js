class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}
const handleError = (err, req, res, next) => {
  try {
    const { statusCode, message } = err
    res.status(statusCode).json({
      status: false,
      data: {},
      message,
    })
  } catch (e) {
    res.status(500).json({
      status: false,
      data: {},
      message: "Something wrong from server",
    })
  }
}

module.exports = {
  ErrorHandler,
  handleError,
}
