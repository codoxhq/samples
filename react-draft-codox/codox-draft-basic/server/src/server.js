const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mainController = require("./controllers/main.controller");
const { errorsMiddleware } = require("./middleware/errors.middleware");

// server builder
class ServerBuilder {
  constructor(MongoConnector) {
    this.PORT = parseInt(process.env.SERVER_PORT) || 5000;
    this.SERVER_IP = process.env.SERVER_IP || "localhost";
    this.apiPrefix = process.env.API_PREFIX || "/api";
    this.server = express();
    this.mongoConnector = new MongoConnector();
  }

  async connectMongoDB() {
    await this.mongoConnector.connect();
  }

  configure() {
    this.server
      .use(cors())
      .use(morgan("combined"))
      .use(express.urlencoded({ extended: false }))
      .use(express.json())
      .use(this.apiPrefix, mainController)
      .use(errorsMiddleware);
    return this;
  }

  listen() {
    this.server.listen(this.PORT, this.SERVER_IP, () =>
      console.log(`Server is listening on ${this.SERVER_IP}:${this.PORT}`)
    );
  }
}

module.exports = ServerBuilder;
