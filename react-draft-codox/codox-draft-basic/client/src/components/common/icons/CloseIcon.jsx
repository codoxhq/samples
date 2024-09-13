import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CloseIconWrapper = styled.div`
  position: absolute;
  top: ${(props) => props.topPerc || 0}%;
  right: ${(props) => props.rightPerc || 0}%;
  cursor: pointer;
  transition: all 0.2s linear;
  font-size: 16px;
  color: black;
  &:hover {
    color: gray;
  }
`;

const CloseIcon = ({ onClick, topPerc, rightPerc }) => {
  return (
    <CloseIconWrapper onClick={onClick} topPerc={topPerc} rightPerc={rightPerc}>
      &#10005;
    </CloseIconWrapper>
  );
};

CloseIcon.propTypes = {
  onClick: PropTypes.func,
  topPerc: PropTypes.number,
  rightPerc: PropTypes.number,
};

CloseIcon.defaultProps = {
  onClick: () => {},
  topPerc: 2,
  rightPerc: 2,
};

export default CloseIcon;
