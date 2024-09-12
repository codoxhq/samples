import React from "react";
import styled from "styled-components";

const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 50px;
  justify-content: space-between;
`;

const Document = styled.div`
  font-family: helvetica, san-serif;
  border: 0.8px solid dimgray;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  padding: 20px;
  margin: 20px 0 0 20px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background-color: #dcdcdc;
  }
  ${(props) => props.isActive && `background-color: #F0F0F0;`}
`;

const DocumentName = styled.div`
  font-size: 24px;
  font-weight: 600;
  text-transform: capitalize;
  color: #303030;
  ${(props) =>
    props.isActive &&
    `
    font-weight: 700;
    color: #1E90FF;
  `}
`;

const DocumentId = styled.div`
  font-size: 16px;
  color: #696969;
`;

const DocumentsSwitcher = ({ docIds, currentDocId, switchDocId }) => {
  return (
    <DocumentsContainer>
      {docIds.map(({ id, name }) => (
        <Document onClick={() => switchDocId(id)} key={id} isActive={id === currentDocId}>
          <DocumentName isActive={id === currentDocId}>{name}</DocumentName>
          <DocumentId>{id}</DocumentId>
        </Document>
      ))}
    </DocumentsContainer>
  );
};

export default DocumentsSwitcher;
