// mongoose models and schemas
const mongoose = require("mongoose");
const { normalizeModelToJSON } = require("./normalizeModels");
const { Schema, } = mongoose;
const { MONGO_COLLECTIONS_NAMES } = require("../constants");

const ContentSubSchema = new Schema(
  {
    insert: { type: String },
    attributes: { type: Object },
  },
  { _id: false }
);

const DocumentSchema = new Schema({
  name: { type: String, default: "" },
  content: {type: Schema.Types.Mixed, default: []},//[ContentSubSchema],
  timestamp: { type: Object},
  meta: {type: Schema.Types.Mixed, default: {}}
});

DocumentSchema.set("toJSON", normalizeModelToJSON);

const DocumentModel = mongoose.model(MONGO_COLLECTIONS_NAMES.documents, DocumentSchema);

module.exports = {
  DocumentModel,
};
