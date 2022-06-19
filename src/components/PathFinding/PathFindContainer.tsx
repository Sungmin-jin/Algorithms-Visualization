import React from 'react';
import Grid from './Grid';
import styled from 'styled-components';
import { usePathFindingContext, AlgorithmOptions } from './PathFindingContext';
import { Box, Button, Typography } from '@material-ui/core';
import DropDown from './DropDown';
import { blockLength } from './constant';
import { useWindowDimensions, useDebounce } from '../../util';

const AlgorithmOption: { value: AlgorithmOptions; itemLabel: string }[] = [
  { value: AlgorithmOptions.Dijkstra, itemLabel: 'Dijkstra' },
  { value: AlgorithmOptions.AStar, itemLabel: 'A-Star' },
  {
    value: AlgorithmOptions.BidirectionDijkstra,
    itemLabel: 'Bidirection Dijkstra',
  },
];

const PathFindingContainer = () => {
  const {
    setGridSize,
    onChangeAlgorithm,
    findPath,
    mouseUpEventHandler,
    durationTime,
    initializeBlocks,
    isRunning,
  } = usePathFindingContext();
  const gridContainerRef = React.useRef<HTMLDivElement>(null);
  const { width, height } = useWindowDimensions();
  const debouncedWidth = useDebounce(width);
  const debouncedHeight = useDebounce(height);

  React.useEffect(() => {
    if (!gridContainerRef.current || isRunning) return;
    const { offsetHeight, offsetWidth } = gridContainerRef.current;
    const row = Math.floor(offsetHeight / blockLength) - 3;
    const col = Math.floor(offsetWidth / blockLength) - 1;
    setGridSize({ row, col });
  }, [debouncedWidth, debouncedHeight]);

  return (
    <StyledContainer onMouseUp={mouseUpEventHandler}>
      <Box display="flex" justifyContent="center" padding="5px 0">
        <ItemContainer display="flex" flexDirection="row">
          <Typography style={{ height: 'fit-content', margin: 'auto' }}>
            Alogorithm:{' '}
          </Typography>
          <DropDown
            menuOption={AlgorithmOption}
            onChange={(e: { target: { value: AlgorithmOptions } }) =>
              onChangeAlgorithm(e.target.value)
            }
            defaultValue={AlgorithmOptions.Dijkstra}
          />
        </ItemContainer>
        <ItemContainer>
          <Button variant="contained" onClick={() => initializeBlocks()}>
            reset
          </Button>
        </ItemContainer>
        <ItemContainer>
          <Button variant="contained" onClick={() => findPath()}>
            Run
          </Button>
        </ItemContainer>
        <ItemContainer
          display="inline"
          style={{ height: 'fit-content', margin: 'auto 0' }}
        >
          duration: {durationTime}ms
        </ItemContainer>
      </Box>
      <StyledGridContainer ref={gridContainerRef}>
        <Grid />
      </StyledGridContainer>
    </StyledContainer>
  );
};

export default PathFindingContainer;

const ItemContainer = styled(Box)`
  padding: 0 10px;
`;

const StyledContainer = styled.div`
  height: 100%;
`;

const StyledGridContainer = styled.div`
  height: 100%;
`;
