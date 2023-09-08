import React, { useRef, useEffect, useState } from "react";

// draftjs components
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
// import styled components
import { EditorWrapper, Title } from "./EditorStyles";
// import Codox lib
import { withCodox } from "@codoxhq/codox-provider";

// decorate editor outside component to avoid re-creations during re-renders or, if place it into comp body, use useMemo to wrap only once
// should pass convertFromRaw/convertToRaw helpers in options
const EditorWithCodox = withCodox(Editor, { convertFromRaw, convertToRaw });

// editor container
const EditorContainer = () => {
  // ref for codox api to call codox methods - should be passed as prop into EditorWithCodox
  const codoxProviderRef = useRef();

  // flag for codox start
  const [codoxStarted, setCodoxStarted] = useState(false);
  const setStartCodox = () => setCodoxStarted(true);

  /**
   * Draft editor state, will store latest synced state
   * setEditorState should be passed as prop to EditorWithCodox, Codox will handle updates
   * Init state with Draft empty state
   */
  const [localEditorState, setEditorState] = useState(EditorState.createEmpty());

  // demo codox config
  const codoxConfig = {
    docId: "mock_docid_1",
    username: "user" + Math.random(),
    apiKey: process.env.REACT_APP_CODOX_API_KEY,
    autoStart: true,
  };

  useEffect(() => {
    const endpoint = `${process.env.REACT_APP_API_HOST}/document`;
    // fetch init state from BE
    fetch(endpoint)
      .then((response) => response.json())
      .then(({ state }) => {
        if (!codoxStarted) {
          // pass fetched state to codox start - codox will handle it and update local state
          codoxProviderRef.current.start(state);
          setStartCodox();
        }
      });

    // will be called on unmount
    return () => {
      // stop codox when component is unmounted - removed from dom
      codoxProviderRef.current.stop();
    };
  }, []);

  // on editor change
  const onEditorChange = (newEditorState) => {
    // only when either content or selection changed
    if (
      !newEditorState.getCurrentContent().equals(localEditorState.getCurrentContent()) ||
      !localEditorState.getSelection().equals(newEditorState.getSelection())
    ) {
      // do any app specific update to editor state

      //delegate to codox provider - MUST NOT update local state explicitly here - codox will do that
      // method can be called when ref is not exising yet, before codox started  - that's why check ref first
      codoxProviderRef &&
        codoxProviderRef.current &&
        codoxProviderRef.current.onEditorChange(newEditorState);
    }
  };

  return (
    <>
      <Title>DraftJS Editor Demo</Title>

      <EditorWrapper>
        <EditorWithCodox
          // required props for codox
          ref={codoxProviderRef}
          config={codoxConfig}
          editorState={localEditorState}
          setEditorState={setEditorState}
          // draft editor native props
          onChange={onEditorChange}
          placeholder="Type your text here..."
          preserveSelectionOnBlur={true}
          // spellCheck
        />
      </EditorWrapper>
    </>
  );
};

export default EditorContainer;
