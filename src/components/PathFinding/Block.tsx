import React, { memo } from 'react';
import styled from 'styled-components';
import { BlockStatusType, BlockType } from './PathFindingContext';
import { blockLength } from './constant';

type BlockPropsType = {
  rowIndex: number;
  colIndex: number;
  onBlockEventHandler?: (
    rowIndex: number,
    colIndex: number,
    updateStatus?: BlockStatusType
  ) => void;
  mouseDownEventHandler: (rowIndex: number, colIndex: number) => void;
  mouseEnterEventHandler: (rowIndex: number, colIndex: number) => void;
  mouseUpEventHandler: () => void;
} & BlockType;

const Block = ({
  rowIndex,
  colIndex,
  status,
  onBlockEventHandler,
  mouseDownEventHandler,
  mouseEnterEventHandler,
  mouseUpEventHandler,
}: BlockPropsType) => {
  const renderCircle = status === 'start' || status === 'end';
  return (
    <StyledBlock
      className={`${rowIndex} ${colIndex}`}
      status={status}
      onClick={
        !onBlockEventHandler
          ? undefined
          : () => onBlockEventHandler(rowIndex, colIndex)
      }
      onMouseDown={() => mouseDownEventHandler(rowIndex, colIndex)}
      onMouseEnter={() => mouseEnterEventHandler(rowIndex, colIndex)}
      onMouseUp={mouseUpEventHandler}
    >
      {renderCircle && <StyledCircle status={status} />}
    </StyledBlock>
  );
};

const MemoBlock = memo(Block);

const StyledBlock = styled.div<{
  status?: BlockStatusType;
}>`
  border: 1px solid black;
  width: ${blockLength}px;
  height: ${blockLength}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ status }) => {
    switch (status) {
      case 'path':
        return '#006978';
      case 'visited':
        return 'rgb(102, 167, 197)';
      case 'obstacle':
        return 'rgb(108, 116, 118)';
      default:
        return 'rgb(251, 251, 251)';
    }
  }};
`;

const StyledCircle = styled.div<{ status: BlockStatusType }>`
  background-color: ${({ status }) =>
    status === 'start' ? 'rgb(173,255,47)' : 'rgb(238, 50, 51)'};
  width: 50%;
  height: 50%;
  border-radius: 50%;
`;

export default MemoBlock;
