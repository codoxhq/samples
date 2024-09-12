const { ERROR_NAMES } = require("../constants");
const { DocumentModel } = require("../models");

class DocumentService {
  async getDocumentById(docId) {
    const doc = await DocumentModel.findOne({ _id: docId });
    console.log("getDocumentById ***: doc ", { doc });
    if (!doc) throw new Error(ERROR_NAMES.notFound);
    return doc;
  }

  async getAllDocumentsIds() {
    const docIds = await DocumentModel.distinct("_id"); // grabs only ids as array
    return docIds;
  }

  /**
   * Method for codox internals: returns document and latest timestamp
   * Returns obj in format {data, timestamp}
   */
  async getDocumentStateWithTimestamp(docId) {
    const document = await DocumentModel.findOne({ _id: docId });
    if (!document) throw new Error(ERROR_NAMES.notFound);
    // extract and group data to match codox required return obj
    const { timestamp, id, state } = document;
    const returnObj = { timestamp, data: { id, state } };
    console.log("[getDocumentStateWithTimestamp]: ", returnObj);
    return returnObj;
  }

  async updateTimestamp({ docId, timestamp }) {
    const result = await DocumentModel.findOneAndUpdate(
      {
        _id: docId,
      },
      { timestamp },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!result) throw new Error(ERROR_NAMES.notFound);
    return result;
  }

  // 17/5/23: experimental (for meta update. future use)
  async updateDocumentMeta({ docId, meta }) {
    const result = await DocumentModel.findOneAndUpdate(
      {
        _id: docId,
      },
      { meta }, // replace the meta
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!result) throw new Error(ERROR_NAMES.notFound);

    console.log("updateTableMeta: updated document.meta = ", result.meta);
    return result;
  }

  async updateDocFullState({ docId, state, timestamp }) {
    console.log("[updateDocFullState]: ", { timestamp, docId, state });

    // safety check - ensure root exists, comments are optional - will default to [] if missing
    if (!state.root) {
      console.error("[updateDocFullState] INVALID STATE OBJECT: ", { state, docId, timestamp });
      throw new Error(ERROR_NAMES.notAcceptable);
    }

    const { commentThreads, root } = state;

    let upd = {
      state: {
        root,
        commentThreads: commentThreads || [],
      },
    };
    if (timestamp) {
      upd.timestamp = timestamp;
    }

    const updated = await DocumentModel.findOneAndUpdate({ _id: docId }, upd, { new: true });
    return updated;
  }
}

module.exports = new DocumentService();
