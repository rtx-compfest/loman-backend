const { validationResult } = require("express-validator");

const resultValidation = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  },
});

function handlerInput(req, res, next) {
  let error = resultValidation(req);
  if (!error.isEmpty()) {
    res.status(406).json({
      status: false,
      errorMessage: error.array()[0].message,
    });
  } else {
    next();
  }
}

module.exports = handlerInput;
