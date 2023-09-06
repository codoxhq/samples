const { Router } = require("express");
const DocumentController = require("./document.controller");

const mainController = Router();
// combine all controllers into main

mainController.use("/document", new DocumentController().init());

module.exports = mainController;
