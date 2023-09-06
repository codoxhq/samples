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

module.exports = {
  normalizeModeltoJSON,
};
