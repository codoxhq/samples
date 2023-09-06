const { ERROR_NAMES } = require("../constants");
const { DocumentModel } = require("../models");

class DocumentService {
  async getFirstDocument() {
    const doc = await DocumentModel.findOne();
    if (!doc) throw new Error(ERROR_NAMES.notFound);
    return doc;
  }
}

module.exports = new DocumentService();
