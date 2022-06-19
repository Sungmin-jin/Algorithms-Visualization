import React from 'react';
import styled from 'styled-components';
import Block from './Block';
import { usePathFindingContext } from './PathFindingContext';
import { blockLength } from './constant';
const Grid = () => {
  const {
    updateBlockStatus,
    mouseEnterEventHandler,
    mouseDownEventHandler,
    mouseUpEventHandler,
    blocks,
    gridSize,
    startPoint,
    endPoint,
  } = usePathFindingContext();

  const gridWidth = gridSize.col * blockLength;
  let i = 0;
  return (
    <FlexContainer width={gridWidth}>
      {blocks.map((row, rowIndex) =>
        row.map((block, colIndex) => (
          <Block
            {...block}
            rowIndex={rowIndex}
            colIndex={colIndex}
            key={i++}
            onBlockEventHandler={
              startPoint && endPoint ? undefined : updateBlockStatus
            }
            mouseDownEventHandler={mouseDownEventHandler}
            mouseEnterEventHandler={mouseEnterEventHandler}
            mouseUpEventHandler={mouseUpEventHandler}
          />
        ))
      )}
    </FlexContainer>
  );
};

const FlexContainer = styled.div<{ width: number }>`
  display: flex;
  width: ${({ width }) => width}px;
  flex-wrap: wrap;
  margin: auto;
`;

export default Grid;
