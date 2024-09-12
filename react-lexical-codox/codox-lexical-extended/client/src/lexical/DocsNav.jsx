import React from 'react';
export default function DocsNav({ docIds, currentDocId, changeCurrentDocId }) {
  const createOnClickHandler = (id) => () => changeCurrentDocId(id);
  let Item = ({ docId, idx }) => {
    let isSelected = docId === currentDocId;
    return (
      <div
        onClick={createOnClickHandler(docId)}
        style={{
          cursor: 'pointer',
          border: '1px solid darkgrey',
          padding: '6px',
          background: 'white',
          borderRadius: '5px',
          ...(isSelected && {
            background: 'rgb(148 234 158 / 58%)',
          }),
        }}
      >
        Document {idx + 1}
        <br />
        <small>{docId}</small>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        justifyContent: 'space-evenly',
        background: 'transparent',
        height: '3em',
        alignItems: 'center',
        fontSize: '17px',
      }}
    >
      {docIds.map((id, idx) => (
        <Item docId={id} idx={idx} key={id} />
      ))}
    </div>
  );
}
