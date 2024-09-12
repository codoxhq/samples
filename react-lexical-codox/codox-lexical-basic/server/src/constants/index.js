const HTTP_CODES = {
  ok: 200,
  created: 201,
  accepted: 202,
  unauthorized: 401,
  notFound: 404,
  badRequest: 400,
  forbidden: 403,
  notAllowed: 405,
  notAcceptable: 406,
  alreadyExists: 409,
  serverError: 500,
  notImplemented: 501,
};

const ERROR_NAMES = Object.keys(HTTP_CODES).reduce((obj, item) => {
  if (HTTP_CODES[item] >= 400) obj[item] = item;
  return obj;
}, {});

module.exports = {
  HTTP_CODES,
  ERROR_NAMES,
};
