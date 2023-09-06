const { HTTP_CODES, ERROR_NAMES } = require("../constants");

const errorsMiddleware = (err, req, res, next) => {
  if (err) {
    console.log("ERRORS MIDDLEWARE CATCH: ", err);
    const errKey = ERROR_NAMES[err.message] || "";
    return res
      .status(HTTP_CODES[errKey] || HTTP_CODES.serverError)
      .json({ message: ERROR_NAMES[err.message] || ERROR_NAMES.serverError });
  }
  next();
};

module.exports = { errorsMiddleware };
