const { validationResult } = require("express-validator")
const { ErrorHandler } = require("./ErrorHandler")

const resultValidation = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    }
  },
})

function handlerInput(req, res, next) {
  let error = resultValidation(req)
  if (!error.isEmpty()) {
    return next(new ErrorHandler(406, error.array()[0].message))
  } else {
    next()
  }
}

module.exports = handlerInput
