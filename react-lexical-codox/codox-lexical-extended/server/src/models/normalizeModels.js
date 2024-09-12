/**
 * Normalize model to JSON: replace _id with id and remove __v
 */
const normalizeModeltoJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

/**
 * Normalize timestamp.session_time back to numeric value
 */
const normalizeTimestampsToJSON = {
  transform: function (doc, ret, options) {
    ret.session_time = ret.session_time.getTime();
  },
};

module.exports = {
  normalizeModeltoJSON,
  normalizeTimestampsToJSON,
};
