// mongoose models and schemas
const mongoose = require("mongoose");
const { normalizeModeltoJSON, normalizeTimestampsToJSON } = require("./normalizeModels");
const { Schema, Types } = mongoose;

const MONGO_COLLECTION_NAMES = {
  documents: "Documents",
};

const TimestampSchema = new Schema(
  {
    session_time: { type: Date }, // use mongo date type for storing session time
    order: { type: Number },
  },
  { strict: true, _id: false }, // don't create _id's for timestamps
);

/**
 * Normalize timestamp when getting from database
 * Reason: mongo stores Date type in stringified format, normalization is converting back to numeric value
 */
TimestampSchema.set("toJSON", normalizeTimestampsToJSON); // for external output to FE
TimestampSchema.set("toObject", normalizeTimestampsToJSON); // for local objects

// TODO: implement comments schema

const DocumentSchema = new Schema(
  {
    state: Schema.Types.Mixed, // for simplicity here no detailed definitions - contains all state: root + comments
    timestamp: TimestampSchema,
    meta: Schema.Types.Mixed,
  },
  { minimize: false, strict: false },
);

DocumentSchema.set("toJSON", normalizeModeltoJSON);

// Models
const DocumentModel = mongoose.model(MONGO_COLLECTION_NAMES.documents, DocumentSchema);

module.exports = {
  DocumentModel,
  MONGO_COLLECTION_NAMES,
};
