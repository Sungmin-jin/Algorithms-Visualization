import React, { useCallback, useMemo, useState } from 'react';
import GraphCard from './GraphCard';
import { SortMethods } from './types';
import styled from 'styled-components';
import { Button, Box } from '@material-ui/core';
const LENGTH = 100;
const MAX = 40;

const Sort = () => {
  const [unsortedList, setUnsortedList] = useState(
    Array.from({ length: LENGTH }, () => Math.random() * MAX)
  );
  const stickWidth = useMemo(() => (1 / unsortedList.length) * 100, [
    unsortedList,
  ]);
  const [started, setStarted] = useState(false);

  const renderGraphCards = useCallback(() => {
    const result = [];
    for (const sort in SortMethods) {
      result.push(
        <GraphCard
          key={sort}
          //@ts-ignore
          sort={SortMethods[sort]}
          unsortedList={unsortedList}
          max={MAX}
          stickWidth={stickWidth}
          started={started}
        />
      );
    }
    return result;
  }, [started, unsortedList, stickWidth]);
  const reset = useCallback(() => {
    let id = window.setTimeout(function () {
      console.log('reset');
    }, 0);
    while (id--) {
      window.clearTimeout(id);
    }
    setStarted(false);
    setUnsortedList(Array.from({ length: LENGTH }, () => Math.random() * MAX));
  }, [setStarted, setUnsortedList]);

  return (
    <div style={{ height: '100%' }}>
      <Box display="flex" justifyContent="center">
        <StyledButton variant="contained" onClick={() => setStarted(true)}>
          start
        </StyledButton>
        <StyledButton variant="contained" onClick={reset}>
          reset
        </StyledButton>
      </Box>
      <StyledContainer>{renderGraphCards()}</StyledContainer>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin: 5px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 90%;
  margin: 0;
`;

export default Sort;
