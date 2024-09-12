import React, { useEffect, useState } from "react";
import QuillEditorContainer from "./quillEditor/QuillEditorContainer";
import { LayoutWrapper, Title } from "./common/styled-wrappers";
import DocumentsSwitcher from "./common/DocumentsSwitcher";
import httpService from "../services/http.service";

const App = () => {
  const [docIds, setDocIds] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);

  useEffect(() => {
    (async () => {
      const docIds = await httpService.getAllDocumentsIds();
      if (!docIds.length) return;
      setDocIds(docIds);
      setCurrentDocId(docIds[0].id);
    })();
  }, []);

  const editorId = "quill_demo";
  let username = `user_${Math.round(Math.random() * 1000)}`;
  return (
    <LayoutWrapper>
      <Title>Quill Editor Demo</Title>
      <DocumentsSwitcher
        docIds={docIds}
        currentDocId={currentDocId}
        switchDocId={setCurrentDocId}
      />
      {currentDocId && (
        <QuillEditorContainer
          editorId={editorId}
          currentDocId={currentDocId}
          username={username}
          key={currentDocId}
        />
      )}
    </LayoutWrapper>
  );
};

export default App;
