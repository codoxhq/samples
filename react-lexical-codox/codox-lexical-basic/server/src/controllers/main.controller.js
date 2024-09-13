const { Router } = require("express");

const DocumentController = require("./document.controller");
const DocumentDeltaController = require("./document.delta.controller");

const mainController = Router();
// combine all controllers into main

mainController.use("/document", new DocumentController().init());
mainController.use("/document/delta", new DocumentDeltaController().init());

module.exports = mainController;
