import React from 'react';
import PathFindingContainer from './PathFindContainer';
import { PathFindingContextProvider } from './PathFindingContext';

const PathFinding = () => {
  return (
    <PathFindingContextProvider>
      <PathFindingContainer />
    </PathFindingContextProvider>
  );
};

export default PathFinding;
