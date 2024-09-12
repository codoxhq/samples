const mongoose = require("mongoose");
const { DocumentModel } = require("../models");

const createInitDataTemplate = (docNumber) => {
  let docMarker = "document #" + docNumber;
  return {
    state: {
      root: {
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "firstPG " + docMarker,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "secondPG" + docMarker,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "thirdPG" + docMarker,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
      },
      commentThreads: [],
    },
  };
};

/**
 * This is only for a demo version.
 * Fill empty database with some demo data
 */
const createDemoData = async () => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const docs = await DocumentModel.find({});
      if (docs.length) return; // populate only when empty

      await DocumentModel.create([
        createInitDataTemplate(1),
        createInitDataTemplate(2),
        createInitDataTemplate(3),
      ]);
    });

    session.endSession();
  } catch (err) {
    console.log("INIT TRANSACTION ERROR:", { err });
  }
};

module.exports = { createDemoData };
