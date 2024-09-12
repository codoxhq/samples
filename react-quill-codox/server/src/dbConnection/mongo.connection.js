const path = require("path");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createDemoData } = require("./createDemoData");

// mongodb connect with mongoose to local memory database
class MongoConnector {
  async connect() {
    /**
     * DISABLED mongo memory db
     *  const connection = new MongoMemoryServer({
      instance: {
        port: parseInt(process.env.MONGODB_PORT) || 27018,
        dbName: process.env.MONGODB_NAME || "demoDB",
        // custom path to db files can be specified. Note, that folder should exist
        // dbPath: path.resolve(__dirname, "..", "..", "test_mongo_database"),
      },
    });
    const mongoUri = await connection.getUri();
     */
    const mongoUri = process.env.MONGO_URI;
    mongoose.connect(mongoUri, {
      autoReconnect: true,
      reconnectTries: 10,
      reconnectInterval: 1000,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("error", (err) => {
      if (err.message.code === "ETIMEDOUT") {
        console.log(err);
        mongoose.connect(mongoUri, mongooseOpts);
      }
      console.log(err);
    });

    mongoose.connection.once("open", () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`);
    });

    if (process.env.NODE_ENV === "development") {
      // create demo data in db
      await createDemoData();

      // this is needed for gracefull shutdown of mongo connection when restarting nodemon, othewise, multiple mongo connections will remain
      process.once("SIGUSR2", async function () {
        try {
          await connection.stop();
          process.kill(process.pid, "SIGUSR2");
        } catch (err) {
          console.log("MONGO STOP ERR", err);
        }
      });
    }
  }
}

module.exports = MongoConnector;
