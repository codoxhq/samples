const { Types } = require("mongoose");
const { ERROR_NAMES } = require("../constants");
const { DocumentModel } = require("../models");

class DocumentService {
  async getFirstDocument() {
    const doc = await DocumentModel.findOne();
    if (!doc) throw new Error(ERROR_NAMES.notFound);
    return doc;
  }

  async getDocumentsList() {
    const docList = await DocumentModel.find({}).select("id");
    return docList;
  }

  async findDocumentById(id = "") {
    const doc = await DocumentModel.findById(id);
    if (!doc) throw new Error(ERROR_NAMES.notFound);
    return doc;
  }

  async updateDocumentById(id = "", updateBatch = {}) {
    console.log("[updateDocumentById]", id, updateBatch);

    const updated = await DocumentModel.findOneAndUpdate(
      { _id: id },
      { ...updateBatch },
      { new: true }
    );
    if (!updated) throw new Error(ERROR_NAMES.notFound);
  }
}

module.exports = new DocumentService();
