// mongoose models and schemas
const mongoose = require("mongoose");
const { normalizeModeltoJSON } = require("./normalizeModels");
const { Schema, Types } = mongoose;

const MONGO_COLLECTION_NAMES = {
  documents: "Docs",
};

const DocumentSchema = new Schema(
  {
    state: { type: Schema.Types.Mixed, default: null },
  },
  { minimize: false }
);

DocumentSchema.set("toJSON", normalizeModeltoJSON);

// Models
const DocumentModel = mongoose.model(MONGO_COLLECTION_NAMES.documents, DocumentSchema);

module.exports = {
  DocumentModel,
  MONGO_COLLECTION_NAMES,
};
