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
              text: "http://test.com",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn95p",
              text: "second line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn96p",
              text: "third line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: "cn97p",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
              data: {},
            },
            {
              key: "cn98p",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 1,
                },
              ],
              data: {},
            },
            {
              key: "cn99p",
              text: "last line of text in demo document",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {
            0: {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "https://picsum.photos/id/237/200/100",
              },
            },
            1: {
              type: "draft-js-video-plugin-video", //  compatible with video plugin types https://www.draft-js-plugins.com/plugin/video

              mutability: "IMMUTABLE",
              data: {
                src: "https://www.youtube.com/watch?v=iEPTlhBmwRg",
              },
            },
          },
        },
      });
    });

    session.endSession();
  } catch (err) {
    console.log("INIT TRANSACTION ERROR:", { err });
  }
};

module.exports = { createDemoData };
