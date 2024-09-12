const { Router } = require("express");
const { HTTP_CODES } = require("../constants");
const documentService = require("../services/document.service");

/**
 * Document controller.
 */
class DocumentController {
  constructor() {
    this.router = Router();
  }

  _tryCatchedDecorator(fn) {
    return async (req, res, next) => {
      try {
        return await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }

  /**
   * Method for codox internals: returns document and latest timestamp
   */
  async getDocumentStateWithTimestamp(req, res) {
    const { docId } = req.params;
    const data = await documentService.getDocumentStateWithTimestamp(docId);
    return res.status(HTTP_CODES.ok).json(data);
  }

  async getDocumentById(req, res) {
    const { docId } = req.params;
    const doc = await documentService.getDocumentById(docId);
    return res.status(HTTP_CODES.ok).json(doc);
  }

  async getDocumentsIds(req, res) {
    const docIds = await documentService.getAllDocumentsIds();
    return res.status(HTTP_CODES.ok).json(docIds);
  }

  init() {
    this.router.get("/all/ids", this._tryCatchedDecorator(this.getDocumentsIds));

    this.router.get("/:docId", this._tryCatchedDecorator(this.getDocumentById));
    // route for codox internals
    this.router.get(
      "/:docId/state/latest",
      this._tryCatchedDecorator(this.getDocumentStateWithTimestamp)
    );

    this.router.get("/access/:docId", this._tryCatchedDecorator(this.checkDocAccess));

    return this.router;
  }
}

module.exports = DocumentController;
