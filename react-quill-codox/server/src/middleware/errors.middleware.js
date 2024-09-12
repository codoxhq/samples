const { HTTP_CODES, ERROR_NAMES } = require("../constants");

const errorsMiddleware = (err, req, res, next) => {
  if (err) {
    console.log("ERRORS MIDDLEWARE CATCH: ", err);

    // check if custom error is thrown
    const customError = ERROR_NAMES[err.message];

    let errCode;
    let errMsg;

    if (customError) {
      /**
       * when custom error, take code from predefined codes
       */
      errCode = HTTP_CODES[customError];
      errMsg = customError;
    } else {
      /**
       * when other errors are thrown (syntax, db fails, etc)
       * ALWAYS respond with 500 + send error message
       * NOTE: errors, captured here, will not have the error code, or the code will not match REST API
       */
      errCode = HTTP_CODES.serverError;
      errMsg = err.message || ERROR_NAMES.serverError;
    }

    return res.status(errCode).json({ message: errMsg });
  }
  next();
};

module.exports = { errorsMiddleware };
