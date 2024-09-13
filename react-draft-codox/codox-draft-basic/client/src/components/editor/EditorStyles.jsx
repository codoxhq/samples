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

export const SelectionElement = styled.span`
  display: inline-block;
  position: relative;
  // caret-color: transparent; // hide native caret - disabled

  // -------------------
  // Custom caret styles - conditional - hide for multiline selections for middle and start lines
  // -------------------
  ${(props) =>
    props.renderCaret &&
    `
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

 

  &::before {
    content: "|";
    position: absolute;
    top: 0px;
    right: ${props.caretPosition.right || "-1px"}; // with default value for safety
    color: transparent;
    font-weight: 900;
    animation: blinker 1s linear infinite;
    width: 2px;
    background: ${props.selectionColor};
  }
  
  `}

  // ----------------------------
  // Text highlighting styles - use same text here as in parent element to preserve hightlight width
  // ----------------------------
  & span span {
    display: inline-block;
    position: relative;
  }

  /**
   * NOTE: we cannot use native ::selection because we cannot make keyword color with opacity
   * need to convert it to rgba
   * */
  // & span span::selection {
  //   background: ${(props) => props.selectionColor};
  //   opacity: 0.1;
  // }

  // & span span::-moz-selection {
  //   background: ${(props) => props.selectionColor};
  //   opacity: 0.1;
  // }

  & span span::before {
    position: absolute;
    content: "${(props) => props.hiddenText}";
    width: inherit;
    height: inherit;
    background: ${(props) => (props.isHighlightText ? props.selectionColor : "transparent")};
    color: ${(props) => (props.isHighlightText ? props.selectionColor : "inherit")};
    opacity: 0.4;
    top: 0;
    left: 0;
    user-select: text;
    z-index: -1;
  }

  // --------------------
  // Tooltip styles - tooltip is conditional - only when in focus
  // --------------------

  @keyframes hideTooltipAnimationKeyframe {
    100% {
      display: none;
    }
  }

  ${(props) =>
    props.renderTooltip &&
    `
  /**
   * NOTE: use 2 pseudo selectors to simulate opacity background.
   * Reason: text colors, like "red" cannot be used together with opacity in rgba
   * other option is to use predefined map of text colors to rgba - it allows to use single pseudo selector
   */
  & span[data-offset-key=${props["data-offset-key"]}] {
    display: inline-block;
    position: relative;
  }
  & span[data-offset-key=${props["data-offset-key"]}]::after {
    // renders toolip text
    content: "${props.tooltipText}";
    position: absolute;
    top: ${props.tooltipCords.top};
    left: ${props.tooltipCords.left};
    padding: 1px 2px;
    border-radius: 3px;
    opacity: 0.9;
    font-size: 12px;
    color: white;
    animation: hideTooltipAnimationKeyframe 0s linear 2s forwards;
  }
  & span[data-offset-key=${props["data-offset-key"]}]::before {
    // renders background color with opacity
    content: "${props.tooltipText}";
    color: ${
      props.selectionColor || "inherit"
    }; // use with same text and "hide" text to preserve sizes match between pseudo selectors
    position: absolute;
    top: ${props.tooltipCords.top};
    left: ${props.tooltipCords.left};
    background: ${props.selectionColor || "transparent"};
    opacity: 0.9;
    padding: 1px 2px;
    border-radius: 3px;
    font-size: 12px;
    animation: hideTooltipAnimationKeyframe 0s linear 2s forwards;
  }
  `}
`;

export const PluginDecorateSpan = styled.span`
  @keyframes hideTooltipAnimationKeyframe {
    100% {
      display: none;
    }
  }

  display: inline-block;
  caret-color: ${(props) => props.selectionColor};
  position: relative;
  &::before {
    content: "${(props) => props.tooltipText}";
    position: absolute;
    top: -25px;
    left: -20px;
    padding: 2px 5px;
    border-radius: 5px;
    ${(props) => !props.tooltipText && "display: none;"}
  }

  & span[data-text="true"] {
    display: inline-block;
    caret-color: ${(props) => props.selectionColor};
    position: relative;
  }

  & span[data-text="true"]::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background: ${(props) => props.selectionColor};
    opacity: 0.2;
    width: 100%;
  }

  & span[data-text="true"]::after {
    content: "${(props) => props.tooltipText}";
    position: absolute;
    top: -25px;
    left: -20px;
    padding: 2px 5px;
    border-radius: 5px;
    color: ${(props) => props.selectionColor};
    background: ${(props) => props.selectionColor};
    opacity: 0.5;
    ${(props) => !props.tooltipText && "display: none;"}
    animation: hideTooltipAnimationKeyframe 0s linear 2s forwards;
  }
`;

export const PanelButton = styled.button`
  // box-sizing: border-box;
  background: #fff;
  border: 1px solid #ddd;
  padding: 0px;
  color: #888;
  margin: 0;
  border-radius: 12px;
  cursor: pointer;
  height: 1.5em;
  width: 2.5em;
  font-size: 1.5em;
  margin: 0;
  width: auto;
  min-width: 2.5em;
  font-size: 1em;
  min-height: 2em;
  padding: 0 5px;
  margin: 0 5px;
  ${(props) =>
    props.isDisabled &&
    `
    pointer-events: none;
    opacity: 0.5;
  
  `}
  &:hover {
    background: #f3f3f3;
  }
  &:active {
    background: #e3dede;
    color: white;
  }
`;
