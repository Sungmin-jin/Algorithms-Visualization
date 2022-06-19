import React from 'react';
import styled from 'styled-components';
import { Breadcrumbs, Typography, Box } from '@material-ui/core';

type NavBarProps = {
  setChosenTab: React.Dispatch<React.SetStateAction<string>>;
  chosenTab: string;
};

const index = ({ setChosenTab, chosenTab }: NavBarProps) => {
  const headerItems = [
    { title: 'Path Finding', key: 'pathFinding' },
    { title: 'Sort', key: 'sort' },
    { title: 'Flocking Algorithm', key: 'flocking' },
    { title: 'Search', key: 'search' },
  ];

  return (
    <Box display="flex" justifyContent="center" padding="10px 0px">
      <Breadcrumbs>
        {headerItems.map(({ title, key }) => (
          <StyledText
            key={key}
            onClick={() => setChosenTab(key)}
            {...(key === chosenTab
              ? { style: { color: 'palevioletred' } }
              : { color: 'textPrimary' })}
          >
            {title}
          </StyledText>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

const StyledText = styled(Typography)<{ isChosen?: boolean }>`
  &:hover,
  &:focus {
    color: palevioletred;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default index;
