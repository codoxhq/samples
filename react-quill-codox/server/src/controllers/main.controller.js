const { Router } = require("express");
const DocumentController = require("./document.controller");

const mainController = Router();
// combine all controllers into main

// test route
mainController.use("/documents", new DocumentController().init());

module.exports = mainController;
