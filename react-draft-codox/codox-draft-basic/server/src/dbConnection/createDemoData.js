const mongoose = require("mongoose");
const { DocumentModel } = require("../models");

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

      await DocumentModel.create({
        state: {
          blocks: [
            {
              key: "cn93p",
              text: "DOC 1 DEMO TEXT",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn94p",
              text: "second line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn95p",
              text: "third line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn96p",
              text: "last line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        },
      });
    });

    session.endSession();
  } catch (err) {
    console.log("INIT TRANSACTION ERROR:", { err });
  }
};

module.exports = { createDemoData };
