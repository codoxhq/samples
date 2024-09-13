import React, { useEffect, useState } from "react";
import EditorContainer from "./editor/EditorContainer";
import httpService from "../services/http.service";
import { Title } from "./editor/EditorStyles";

function App() {
  const [docId, setDocId] = useState(null);
  const [docIds, setDocIds] = useState([]);
  useEffect(() => {
    (async () => {
      const docIds = await httpService.getDocumentIds();
      setDocIds(docIds);

      let id = docIds[0] && docIds[0].id;
      // console.log({ id });
      if (id) setDocId(id);
    })();
  }, []);

  const switchDocId = (id) => () => {
    setDocId(id);
  };

  const username = "user" + Math.round(Math.random() * 1000);

  return (
    <>
      <Title>DraftJS Editor Demo</Title>
      <div className="doc_nav">
        {docIds.map(({ id }) => {
          return (
            <button
              onClick={switchDocId(id)}
              key={id}
              style={{
                background: id === docId ? "lightgreen" : "transparent",
              }}
            >
              DocId {id}
            </button>
          );
        })}
      </div>
      {docId && <EditorContainer docId={docId} username={username} />};
    </>
  );
}

export default App;
