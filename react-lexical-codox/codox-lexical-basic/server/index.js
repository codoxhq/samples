const dotenv = require("dotenv");
const ServerBuilder = require("./src/server");
const MongoConnector = require("./src/dbConnection/mongo.connection");

// parse envs from .env file
dotenv.config();

if (!process.env.NODE_ENV) {
  // run dev mode by default
  process.env.NODE_ENV = "development";
}

// start server
(async () => {
  try {
    const server = new ServerBuilder(MongoConnector);
    await server.connectMongoDB();
    server.configure().listen();
  } catch (err) {
    console.error("SERVER ERROR", err);
    process.exit(1);
  }
})();
