import React from 'react';
import styled from 'styled-components';
import './grid.css';

type CellPropsType = {
  colFound: boolean;
  colVisited: boolean;
  colSource: boolean;
  colTarget: boolean;
  col: any;
  setNode: (col: any) => void;
};

const Cell = ({
  colVisited,
  colFound,
  colSource,
  colTarget,
  col,
  setNode,
}: CellPropsType) => {
  return (
    <StyledNode
      className="node"
      visited={colVisited}
      found={colFound}
      source={colSource}
      target={colTarget}
      onClick={() => setNode(col)}
    >
      {col.data}
    </StyledNode>
  );
};

const MemoCell = React.memo(Cell);

const StyledNode = styled.div<{
  visited: boolean;
  found: boolean;
  source: boolean;
  target: boolean;
}>`
  ${({ visited, found, source, target }) => {
    switch (true) {
      case visited:
        return `background-color : #68d7fc;`;
      case found:
        return `background-color : #FFFF00;`;
      case source:
        return `background-color : #00FF00;`;
      case target:
        return `background-color : #FFC0CB;`;
      default:
        return `background-color : #fdfdfd;`;
    }
  }}
`;

export default MemoCell;
