const { Router } = require("express");
const { HTTP_CODES } = require("../constants");
const documentService = require("../services/document.service");

class DocumentController {
  constructor() {
    this.router = Router();
  }

  async getDocumentById(req, res, next) {
    console.log("getDocumentById:*******  req.params = ", req.params);
    console.log("getDocumentById:*******  req.body = ", req.body);
    try {
      const { docId } = req.params;
      const doc = await documentService.getDocumentById(docId);
      return res.status(HTTP_CODES.ok).json(doc);
    } catch (err) {
      next(err);
    }
  }

  async updateDocumentContent(req, res, next) {
    console.log("updateDocumentContent:******* UPDATES: body= ", req.body);
    try {
      const { docId } = req.params;
      const { content } = req.body;
      const updatedDoc = await documentService.updateDocumentContent({ docId, content });
      return res.status(HTTP_CODES.accepted).json(updatedDoc);
    } catch (err) {
      next(err);
    }
  }

  async getAllDocumentsIds(req, res, next) {
    try {
      const docs = await documentService.getAllDocumentsIds();
      return res.status(HTTP_CODES.ok).json(docs);
    } catch (err) {
      next(err);
    }
  }

  // 14/5/23； revised with a new codox meta ({docId, sts, to})
  async handleDocumentUpdates(req, res, next) {
    try {
      console.log("handleDocumentUpdates: body = ", req.body);
      const { meta, data } = req.body;
      const updatedDoc = await documentService.updateDocumentContent({
        meta: meta, // note: update meta together with content, for potential future use 
        content: data,
      });
      return res.status(HTTP_CODES.accepted).json(updatedDoc);
    } catch (err) {
      next(err);
    }
  }

  init() {
    this.router.get("/", this.getAllDocumentsIds);
    this.router.get("/:docId", this.getDocumentById);
    this.router.put("/:docId/content", this.updateDocumentContent); // disabled on FE
    this.router.post("/update/content", this.handleDocumentUpdates);
    return this.router;
  }
}

module.exports = DocumentController;
