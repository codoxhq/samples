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

  init() {
    this.router.get("/", this._tryCatchedDecorator(this.getFirstDocument));
    return this.router;
  }
}

module.exports = DocumentController;
