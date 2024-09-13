const { Router } = require("express");
const { HTTP_CODES } = require("../constants");
const documentService = require("../services/document.service");
const chalk = require("chalk");
const { getAction, getPropValue, getObject } = require("./deltaTranslator");

const ACTIONS = {
  CREATE_DATA: "CREATE_LIST_ITEM_ROWS",
  DELETE_DATA: "DELETE_LIST_ITEM_ROWS",
  UPDATE_ROWS: "UPDATE_OBJ_PROP_ROWS",
  UPDATE_COLUMN: "UPDATE_OBJ_PROP_COLUMNS",
};

/**
 * Document delta changes controller.
 */
class DocumentDeltaController {
  constructor() {
    this.router = Router();
  }

  _tryCatchedDecorator(fn) {
    fn = fn.bind(this);
    return async (req, res, next) => {
      try {
        return await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }

  /**
   * Update content route handler
   */
  async updateContent(req, res) {
    const { data, meta } = req.body;
    const { docId, timestamp } = meta;
    const { state } = data;
    console.log("[updateContent ENDPOINT CALLED]: ", { data, meta });

    /**
     * DEV NOTE: state is expected in data - state should contain both comments and root:  state = {root, comments}
     */
    if (docId && state) {
      await documentService.updateDocFullState({ docId, state, timestamp });
    } else {
      console.log("[updateContent]: UPDATE SKIPPED - state is missing", {
        data,
        meta,
      });
    }

    // await this.handleUpdateContent({ data, meta });

    res.sendStatus(HTTP_CODES.accepted);
  }

  /**
   * Initializes the DocumentDeltaController router and sets up the necessary routes.
   *
   * @returns {object} Returns the DocumentDeltaController router.
   */
  init() {
    this.router.post("/content/updateClient", this._tryCatchedDecorator(this.updateContent));

    return this.router;
  }
}

module.exports = DocumentDeltaController;
