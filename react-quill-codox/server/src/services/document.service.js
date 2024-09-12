const { DocumentModel } = require("../models");
const { ERROR_NAMES } = require("../constants");

class DocumentService {
  async getDocumentById(id) {
    const document = await DocumentModel.findById(id);
    if (!document) throw new Error(ERROR_NAMES.notFound);
    console.log("getDocumentById: doc = ", document);
    return document;
  }

  async updateDocumentContent({ meta, content }) {

    console.log("[updateDocumentContent]: content", content);

    const updated = await DocumentModel.findOneAndUpdate(
      {
        _id: meta.docId,
      },
      { content: content.content, meta, timestamp: meta.timestamp}, // add meta including docId, sts and to
      { new: true, useFindAndModify: false }
    );
    if (!updated) throw new Error(ERROR_NAMES.notFound);

    console.log("updateDocumentContent: updated doc.meta = ", updated.meta);

    console.log("UPDATED DOC: ", updated)

    return { content: updated.content, timestamp: updated.timestamp, meta: updated.meta };
  }

  async getAllDocumentsIds() {
    const documentsIds = await DocumentModel.find({}, {}, { projection: { id: 1, name: 1 } });
    if (!documentsIds) throw new Error(ERROR_NAMES.notFound);
    return documentsIds;
  }
}

module.exports = new DocumentService();
