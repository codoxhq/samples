import React, { useRef, useEffect, useState } from "react";

// draftjs components
import {
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import Editor from "@draft-js-plugins/editor"; // use wrapped editor for plugins integrations
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createImagePlugin from "@draft-js-plugins/image";
import createVideoPlugin from "@draft-js-plugins/video";
import createMentionPlugin, { defaultSuggestionsFilter } from "@draft-js-plugins/mention";

import { EditorWrapper, PanelButton, Title } from "./EditorStyles";
// extra components for plugins
import AddImage from "./AddImage";
import AddVideo from "./AddVideo";
import MentionsContainer from "./Mentions/MentionsContainer";

// components for rich text
import InlineStyleControls from "./InlineStyleControls";
import BlockStyleControls from "./BlockStyleControls";

// import Codox lib
import { withCodox } from "codox-provider";

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
// should pass convertFromRaw/convertToRaw helpers in options
const EditorWithCodox = withCodox(Editor, { convertFromRaw, convertToRaw });

// editor container
const EditorContainer = () => {
  // ref for codox api to call codox methods - should be passed as prop into EditorWithCodox
  const codoxProviderRef = useRef();

  // flag for codox start
  const [codoxStarted, setCodoxStarted] = useState(false);

  /**
   * Draft editor state, will store latest synced state
   * setEditorState should be passed as prop to EditorWithCodox, Codox will handle updates
   * Init state with Draft empty state
   */
  const [localEditorState, setEditorState] = useState(EditorState.createEmpty());

  // example of codox config
  const codoxConfig = {
    docId: "mock_docid_1",
    username: "user" + Math.random(),
    apiKey: process.env.REACT_APP_CODOX_API_KEY,
    autoStart: true,
  };

  const setStartCodox = () => setCodoxStarted(true);

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
    const contentState = localEditorState.getCurrentContent();
    if (!contentState.hasText()) {
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

  return (
    <>
      <Title>DraftJS Editor Demo</Title>

      <EditorWrapper>
        <BlockStyleControls editorState={localEditorState} onToggle={toggleBlockType} />
        <InlineStyleControls editorState={localEditorState} onToggle={toggleInlineStyle} />
        <div>
          <PanelButton
            onClick={onUndo}
            isDisabled={localEditorState.getUndoStack().size === 0} // when undo stack is empty
          >
            Undo
          </PanelButton>
          <PanelButton
            onClick={onRedo}
            isDisabled={localEditorState.getRedoStack().size === 0} // when redo stack is empty
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
            config={codoxConfig}
            editorState={localEditorState}
            setEditorState={setEditorState}
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
              console.log("todo: handle added mention", { data });
            }}
          />
        </div>
      </EditorWrapper>
    </>
  );
};

export default EditorContainer;
