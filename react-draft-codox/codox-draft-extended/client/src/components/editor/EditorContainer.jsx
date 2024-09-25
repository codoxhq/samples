import React, { useRef, useEffect, useState, memo, useMemo } from "react";

// draftjs components
import {
  //   Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  ContentState,
} from "draft-js";
import Editor from "@draft-js-plugins/editor"; // use wrapped editor with plugins integrations
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createImagePlugin from "@draft-js-plugins/image";
import createVideoPlugin from "@draft-js-plugins/video";
import createMentionPlugin, { defaultSuggestionsFilter } from "@draft-js-plugins/mention";

import { EditorWrapper, PanelButton, Title } from "./EditorStyles";
import InlineStyleControls from "./InlineStyleControls";
import BlockStyleControls from "./BlockStyleControls";
import AddImage from "./AddImage";
import AddVideo from "./AddVideo";
import MentionsContainer from "./Mentions/MentionsContainer";

import { withCodox } from "../../codoxCollab";
import httpService from "../../services/http.service";

/**
 * Plugins from @draft-js-plugins
 * Create outside the scope of component.
 */
const linkifyPlugin = createLinkifyPlugin({ target: "_blank" });
const imagePlugin = createImagePlugin();
const videoPlugin = createVideoPlugin();
const mentionPlugin = createMentionPlugin();

// plugins map
const plugins = {
  linkifyPlugin,
  imagePlugin,
  videoPlugin,
  mentionPlugin,
};
const pluginsList = Object.values(plugins); //array representation

// decorate editor outside component to avoid re-creations during re-renders or, if place it into comp body, use useMemo to wrap only once
const EditorWithCodox = withCodox(Editor);

// editor container
const EditorContainer = ({ docId, username }) => {
  // ref for codox api to call codox methods - should be passed as prop into EditorWithCodox
  const codoxProviderRef = useRef();

  // flag for codox start
  const [codoxStarted, setCodoxStarted] = useState(false);
  const [initStateReady, setInitStateReady] = useState(false);

  /**
   * Draft editor state, will store latest synced state
   * setEditorState should be passed as prop to EditorWithCodox, Codox will handle updates
   * Init state with Draft empty state
   */
  const [localEditorState, setEditorState] = useState(EditorState.createEmpty());

  // will be invoked by codox to get latest server state when going back online
  const fetchDocOnNetworkReconnect = async () => {
    const { state, timestamp = Date.now() } = await httpService.getFirstDocument();
    // response must match the following schema:
    return { content: state, timestamp };
  };

  const contentChangedHookCB = (data) => {
    console.log("[Drat Demo][contentChanged hook] hook invoked by Codox: ", data);
    const { source, content } = data;
    /**
     * source can be one of "local", "remote"
     * content is full lexical json state: root with comments
     * Trigger save to db only for "local" changes
     */
    if (source === "local") {
      (async () => {
        await httpService.updateDocumentById(docId, content);
      })();
    }
  };
  // example of codox config
  const codoxConfig = {
    docId,
    username,
    apiKey: process.env.REACT_APP_CODOX_API_KEY,
    autoStart: true,
    hooks: {
      fetchDocOnNetworkReconnect,
      contentChanged: contentChangedHookCB,
      usersUpdate: (data) => {
        console.log("[Drat Demo][usersUpdate hook] hook invoked by Codox: ", data);
      },
    },
  };

  const setState = (state) => {
    // NOTE: returned state preserve undo/redo stacks
    setEditorState(state);
  };
  const setStartCodox = () => setCodoxStarted(true);

  useEffect(() => {
    // fetch init state from BE
    setInitStateReady(false);

    // stop codox when docId changes
    if (codoxStarted) {
      codoxProviderRef.current.stop();
      console.log("[Draft Demo] codox stopped");
      setCodoxStarted(false);
    }

    httpService.getDocumentById(docId).then(({ state }) => {
      // create init draft state out of json state
      console.log("[Draft Demo] with init state before start codox: ", state);

      const draftContentState = convertFromRaw(state);
      const draftState = EditorState.createWithContent(draftContentState);
      setEditorState(draftState);
      setInitStateReady(true);
    });
  }, [docId]);

  useEffect(() => {
    if (!codoxStarted && initStateReady) {
      console.log("[Draft Demo] with init state before start codox: ", {
        localEditorStateJSON: convertToRaw(localEditorState.getCurrentContent()),
      });

      // Example of subscribing to codox events
      const events = ["content_changed", "error", "users_update"];
      events.forEach((event) => {
        console.log("[Draft Demo][Subscribe to Codox Event]: ", event);

        codoxProviderRef.current.on(event, (data) => {
          console.log("[Draft Demo][Codox Event Emitted]: ", { event, data });
        });
      });

      // pass fetched state to codox start - codox will handle it and update local state
      codoxProviderRef.current
        .start(codoxConfig)
        .then(() => {
          console.log("[Draft Demo][codox.start] success");
          setStartCodox();
          //
        })
        .catch((err) => console.log("[Draft Demo][codox.start] error", err));
    }
  }, [initStateReady]);

  // on editor change
  const onEditorChange = (newEditorState) => {
    // only when either content or selection changed
    if (
      !newEditorState.getCurrentContent().equals(localEditorState.getCurrentContent()) ||
      !localEditorState.getSelection().equals(newEditorState.getSelection())
    ) {
      // do any app specific update to editor state

      console.log("[Draft Demo][onEditorChange]:", {
        newSelection: newEditorState.getSelection().toObject(),
        currentSelection: localEditorState.getSelection().toObject(),
      });
      //delegate to codox provider - MUST NOT update local state explicitly here - codox will do that
      // method can be called when ref is not exising yet, before codox started  - that's why check ref first
      codoxProviderRef &&
        codoxProviderRef.current &&
        codoxProviderRef.current.onEditorChange(newEditorState);
    }
  };

  const handleKeyCommand = (command, editorState) => {
    // rich utils process
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onEditorChange(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9) {
      // TAB
      const newEditorState = RichUtils.onTab(e, localEditorState, 4); // 4 is for maxDepth

      if (newEditorState !== localEditorState) {
        onEditorChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType) => {
    onEditorChange(RichUtils.toggleBlockType(localEditorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    onEditorChange(RichUtils.toggleInlineStyle(localEditorState, inlineStyle));
  };

  //   styling related functions
  const pickupEditorInnerWrapperStyles = () => {
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    const contentState = localEditorState && localEditorState.getCurrentContent();
    if (contentState && !contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }
    return className;
  };

  // Custom overrides for "code" style.
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  function getBlockStyle(block) {
    return block.getType() === "blockquote" ? "RichEditor-blockquote" : null;
  }

  const onUndo = () => {
    // delegate undo to codox
    codoxProviderRef.current.onUndo(localEditorState);
  };

  const onRedo = () => {
    // delegate redo to codox
    codoxProviderRef.current.onRedo(localEditorState);
  };

  const hideCursors = () => {
    codoxProviderRef.current.cursor.hide();
  };

  const showCursors = () => {
    codoxProviderRef.current.cursor.show();
  };

  let isUndoStackEmpty = localEditorState && localEditorState.getUndoStack().size === 0;
  let isRedoStackIsEmpty = localEditorState && localEditorState.getRedoStack().size === 0;

  return (
    <>
      <EditorWrapper>
        {localEditorState && (
          <>
            <BlockStyleControls editorState={localEditorState} onToggle={toggleBlockType} />
            <InlineStyleControls editorState={localEditorState} onToggle={toggleInlineStyle} />
          </>
        )}

        <div>
          <PanelButton onClick={hideCursors}>hide remote cursors</PanelButton>
          <PanelButton onClick={showCursors}>show remote cursors</PanelButton>
          <PanelButton
            onClick={onUndo}
            isDisabled={isUndoStackEmpty} // when undo stack is empty
          >
            Undo
          </PanelButton>
          <PanelButton
            onClick={onRedo}
            isDisabled={isRedoStackIsEmpty} // when redo stack is empty
          >
            Redo
          </PanelButton>
          <AddImage
            editorState={localEditorState}
            onChange={onEditorChange}
            modifier={plugins.imagePlugin.addImage}
          />
          <AddVideo
            editorState={localEditorState}
            onChange={onEditorChange}
            modifier={plugins.videoPlugin.addVideo}
          />
        </div>

        <div className={pickupEditorInnerWrapperStyles()}>
          <EditorWithCodox
            // required props for codox
            ref={codoxProviderRef}
            editorState={localEditorState}
            setEditorState={setState}
            // draft editor native props
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={onEditorChange}
            placeholder="Type your text here..."
            preserveSelectionOnBlur={true}
            plugins={pluginsList} // optional, in case of plugins usage
            // spellCheck
          />
          <MentionsContainer
            mentionPlugin={plugins.mentionPlugin}
            defaultSuggestionsFilter={defaultSuggestionsFilter}
            onAddMention={(...data) => {
              // get the mention object selected
              console.log("[Draft Demo][onAddMention] todo: handle added mention", { data });
            }}
          />
        </div>
      </EditorWrapper>
    </>
  );
};

export default memo(EditorContainer);
