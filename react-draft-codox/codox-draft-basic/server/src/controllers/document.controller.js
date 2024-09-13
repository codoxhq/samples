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

  async getFirstDocument(req, res) {
    const doc = await documentService.getFirstDocument();
    res.status(HTTP_CODES.ok).json(doc);
  }

  async getDocumentsList(req, res) {
    const list = await documentService.getDocumentsList();
    res.status(HTTP_CODES.ok).json(list);
  }

  async findDocumentById(req, res) {
    const doc = await documentService.findDocumentById(req.params.id);
    res.status(HTTP_CODES.ok).json(doc);
  }

  async updateDocumentById(req, res) {
    await documentService.updateDocumentById(req.params.id, req.body.updateBatch);
    res.sendStatus(HTTP_CODES.accepted);
  }

  init() {
    this.router.get("/", this._tryCatchedDecorator(this.getFirstDocument));
    this.router.get("/list", this._tryCatchedDecorator(this.getDocumentsList));
    this.router.get("/:id", this._tryCatchedDecorator(this.findDocumentById));
    this.router.put("/:id", this._tryCatchedDecorator(this.updateDocumentById));

    return this.router;
  }
}

module.exports = DocumentController;
