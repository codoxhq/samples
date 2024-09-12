import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Quill from "quill";
import ImageResize from "quill-image-resize";
import QuillEditor from "./QuillEditor";
import httpService from "../../services/http.service";

import Codox from "../../codoxCollab";

let toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block", "image", "clean"], // "clean" button removes all prev formatting
  ["link"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
];

Quill.register("modules/imageResize", ImageResize);

const QuillEditorContainer = ({ editorId, currentDocId, username }) => {
  const [codox, setCodox] = useState(null);
  const [initDocState, setInitDocState] = useState(null);
  const [codoxStarted, setCodoxStarted] = useState(false);
  const [codoxStartInProgress, setCodoxStartInProgress] = useState(false);

  useEffect(() => {
    console.log("DEBUG: MOUNTED");
    //
    return () => {
      console.log("DEBUG: UNMOUNTED");
    };
  }, []);

  // decorated hook with latest quill editor ref
  const createContentUpdatedHook = (editorRef) => async (data) => {
    if (!editorRef) return;
    console.log("[contentUpdatedHook] hook invoked: ", { ...data });
    /**
     * Do update of content in db here
     * data.source can be one of "local", "remote"
     */
    if (data.source === "local") {
      // take full state
      const fullDeltas = editorRef.getContents();
      console.log({ fullDeltas });
      // update database
      await httpService.updateDocumentContent({
        meta: { docId: currentDocId },
        data: { content: fullDeltas.ops },
      });
    }
  };

  const usersUpdateHook = (data) => {
    console.log("[usersUpdateHook] hook invoked: ", data);
  };

  const fetchDocOnNetworkReconnectHook = async () => {
    console.log("[fetchDocOnNetworkReconnect] hook invoked");
    const { content, timestamp } = await httpService.getDocumentById(currentDocId);
    return { content: { ops: content }, timestamp: timestamp || -1 };
  };

  useEffect(() => {
    console.log("EditorContainer mounted: ", currentDocId);
    (async () => {
      const { content } = await httpService.getDocumentById(currentDocId);
      console.log({ content });
      setInitDocState(content);
    })();

    return () => {
      console.log("EditorContainer unmounted: ", currentDocId);
      setInitDocState(null);
    };
  }, [currentDocId]);

  useEffect(() => {
    if (!initDocState || codoxStartInProgress || codoxStarted) return;

    setCodoxStartInProgress(true);

    let editor = new Quill(`#${editorId}`, {
      theme: "snow",
      placeholder: "Edit this demo document...",
      modules: {
        imageResize: {},
        toolbar: toolbarOptions,
      },
    });
    //
    editor.updateContents(initDocState, "silent");

    const codox = new Codox();

    // create codox config
    let codoxConfig = {
      app: "quilljs",
      editor: editor,
      docId: currentDocId, //this is the unique id used to distinguish different documents
      username, //unique user name
      apiKey: process.env.REACT_APP_CODOX_API_KEY, // codox apiKey
      // demo: true,
      hooks: {
        fetchDocOnNetworkReconnect: fetchDocOnNetworkReconnectHook,
        usersUpdate: usersUpdateHook,
        contentChanged: createContentUpdatedHook(editor),
      },
    };
    //
    const events = ["content_changed", "error", "users_update"];
    events.forEach((event) => {
      console.log("Subscibing to Codox event: ", event);
      codox.on(event, (data) => {
        console.log("[CODOX API] event triggered: ", { event, data });
      });
    });

    (async () => {
      //start coediting
      await codox
        .start(codoxConfig)
        .then(() => {
          console.log("[codox.start] success");
          setCodox(codox);
          setCodoxStarted(true);
        })
        .catch((err) => console.log("[codox.start] error", err))
        .finally(() => {
          setCodoxStartInProgress(false);
        });
    })();

    return () => {
      codox.stop();
      setCodox(null);
      setCodoxStarted(false);
      /**
       * Since Quill does not have api to destroy/umnount editor from dom, do it manually
       */
      document.querySelector(`#${editorId}`).replaceChildren(); // clean up editor element
      let toolbar = document.querySelector(".ql-toolbar");
      if (toolbar) toolbar.remove(); // remove toolbar
    };
  }, [initDocState]);

  const hideCursors = () => {
    codox.cursor.hide();
  };

  const showCursors = () => {
    codox.cursor.show();
  };

  return (
    <>
      <div className="cursors_nav">
        <button onClick={hideCursors}>hide remote cursors</button>
        <button onClick={showCursors}>show remote cursors</button>
      </div>
      <QuillEditor editorId={`${editorId}`} key={currentDocId} />
    </>
  );
};
//
QuillEditorContainer.propTypes = {
  editorId: PropTypes.string,
};

QuillEditorContainer.defaultProps = {
  editorId: "quill_editor",
};

export default QuillEditorContainer;
