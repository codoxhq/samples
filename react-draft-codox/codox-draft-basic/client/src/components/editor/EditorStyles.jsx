import styled from "styled-components";

export const EditorWrapper = styled.div`
  font-family: "Georgia", serif;
  font-size: 14px;
  padding: 15px;
  min-height: 600px;
  width: 80%;
  margin: 50px auto;
  position: relative;

  box-shadow: 4px 4px 41px 0px rgba(34, 60, 80, 0.2);
  ${(props) =>
    props.isDisabled
      ? `
    &::before {
      display: block;
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background:#dcdcdcbd;
      z-index: 10;
      pointer-events: none;
    }
  
  `
      : ""}

  & * {
    pointer-events: ${(props) => (props.isDisabled ? "none" : "auto")};
  }

  & .RichEditor-editor {
    border-top: 1px solid #ddd;
    cursor: text;
    font-size: 16px;
    margin-top: 10px;
  }

  & .RichEditor-editor .public-DraftEditorPlaceholder-root,
  .RichEditor-editor .public-DraftEditor-content {
    margin: 0 -15px -15px;
    padding: 15px;
  }

  & .RichEditor-editor .public-DraftEditor-content {
    min-height: 100px;
  }

  & .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
    display: none;
  }

  & .RichEditor-editor .RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-family: "Hoefler Text", "Georgia", serif;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }

  & .RichEditor-editor .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: "Inconsolata", "Menlo", "Consolas", monospace;
    font-size: 16px;
    padding: 20px;
  }

  & .RichEditor-controls {
    font-family: "Helvetica", sans-serif;
    font-size: 14px;
    margin-bottom: 5px;
    user-select: none;
  }

  & .RichEditor-styleButton {
    color: #999;
    cursor: pointer;
    margin-right: 16px;
    padding: 2px 0;
    display: inline-block;
  }

  & .RichEditor-activeButton {
    color: #5890ff;
  }
`;

export const Title = styled.h1`
  width: 100%;
  text-align: center;
`;
