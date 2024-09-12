import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const EditorWrapper = styled.div`
  width: 80vw;
  height: 50%;
  margin: 0 auto;
  & .ql-container,
  & .ql-toolbar {
    background: #ffffffd6;
  }
  & .ql-editor {
    font-size: 14px;
    letter-spacing: 1px;
  }
`;

const QuillEditor = ({ editorId }) => {
  return (
    <EditorWrapper>
      <div id={editorId} />
    </EditorWrapper>
  );
};

QuillEditor.propTypes = {
  editorId: PropTypes.string.isRequired,
};

export default QuillEditor;
