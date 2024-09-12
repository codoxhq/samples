const mongoose = require( "mongoose" );
const { DocumentModel } = require( "../models" );

const documentsTextsMock = [ "first", "second", "third" ];

/**
 * This is only for a demo version.
 * Fill empty database with some demo data
 */
const createDemoData = async () =>
{
  try {
    const session = await mongoose.startSession();
    await session.withTransaction( async () =>
    {
      const docs = await DocumentModel.find( {} );
      if ( docs.length ) return; // populate only when empty
      const docsIds = await Promise.all(
        documentsTextsMock.map( async ( text ) =>
        {
          return await DocumentModel.create( {
            name: `${ text } document`,
            content: [
              {
                insert: "This is ",
              },
              {
                insert: `editable ${ text } document `,
              },
              { insert: "\n" },
            ],
          } );
        } )
      );
    } );
    session.endSession();
  } catch ( err ) {
    console.log( "INIT TRANSACTION ERROR:", { err } );
  }
};

module.exports = { createDemoData };
