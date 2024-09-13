import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const LoadingSpinnerWrapper = styled.div`
  position: ${(props) => (props.fillParent ? "absolute" : "fixed")};
  height: ${(props) => (props.fillParent ? "100%" : "100vh")};
  width: ${(props) => (props.fillParent ? "100%" : "100vw")};
  top: 0;
  left: 0;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.8);
  color: black;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
`;

// TODO: customize styles
const LoadingSpinner = ({ fillParent }) => {
  // TODO: add some loading icon and animation or use lib
  return <LoadingSpinnerWrapper fillParent={fillParent}>LOADING...</LoadingSpinnerWrapper>;
};

LoadingSpinner.propTypes = {
  fillParent: PropTypes.bool,
};
LoadingSpinner.defaultProps = {
  fillParent: false,
};

export default LoadingSpinner;
