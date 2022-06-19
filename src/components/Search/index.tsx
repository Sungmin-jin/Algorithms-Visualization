import React from 'react';
import './grid.css';
import { bfsAlgorithm } from './bfs';
import { dfsAlgorithm } from './dfs';
import Button from '@mui/material/Button';
import Cell from './cell';

const ROW_SIZE = 10;
const COL_SIZE = 10;

const Search = () => {
  // Initiazlize 2d cell array
  const initCell = () => {
    const row = [];
    let num = 100;
    for (let i = 0; i < ROW_SIZE; i++) {
      const col = [];
      for (let j = 0; j < COL_SIZE; j++) {
        col.push({
          data: num,
          row: i,
          col: j,
          visited: false,
          found: false,
          source: false,
          target: false,
        });
        num--;
      }
      row.push(col);
    }
    return row;
  };

  const [nodes, setNodes] = React.useState(initCell());

  const [isSourceSet, setIsSourceSet] = React.useState(false);
  const [sourcePosition, setSourcePosition] = React.useState({
    row: -1,
    col: -1,
  });

  const [isTargetSet, setIsTargetSet] = React.useState(false);
  const [targetPosition, setTargetPosition] = React.useState({
    row: -1,
    col: -1,
  });

  const setVisited = React.useCallback(
    (row: number, col: number) => {
      setNodes((prev) => {
        return prev.map((rowNode) =>
          rowNode.map((node) =>
            Number(node.row) === row && Number(node.col) === col
              ? {
                  ...node,
                  visited: true,
                }
              : { ...node }
          )
        );
      });
    },
    [setNodes]
  );

  const setFound = React.useCallback(
    (row: number, col: number) => {
      setNodes((prev) => {
        return prev.map((rowNode) =>
          rowNode.map((node) =>
            Number(node.row) === row && Number(node.col) === col
              ? {
                  ...node,
                  found: true,
                }
              : { ...node }
          )
        );
      });
    },
    [setNodes]
  );

  const setNode = React.useCallback(
    (cell: any) => {
      if (isTargetSet) {
        console.log('Source and target are already chosen!');
        return;
      }
      const setRow = cell['row'];
      const setCol = cell['col'];

      const updatedPosition = { row: setRow, col: setCol };
      if (!isSourceSet) {
        setIsSourceSet(true);
        setSourcePosition(updatedPosition);

        setNodes((prev) => {
          return prev.map((rowNode) =>
            rowNode.map((node) =>
              Number(node.row) === setRow && Number(node.col) === setCol
                ? {
                    ...node,
                    source: true,
                  }
                : { ...node }
            )
          );
        });
      } else {
        setIsTargetSet(true);
        setTargetPosition(updatedPosition);

        setNodes((prev) => {
          return prev.map((rowNode) =>
            rowNode.map((node) =>
              Number(node.row) === setRow && Number(node.col) === setCol
                ? {
                    ...node,
                    target: true,
                  }
                : { ...node }
            )
          );
        });
      }
    },
    [
      setIsSourceSet,
      setNodes,
      setSourcePosition,
      setIsTargetSet,
      setTargetPosition,
      isTargetSet,
      isSourceSet,
    ]
  );

  const applyLog = React.useCallback(
    (visitedLog) => {
      for (let i = 0; i < visitedLog.length; i++) {
        const visited = visitedLog[i];
        if (visited['isTarget']) {
          setTimeout(function () {
            setFound(visited['row'], visited['col']);
          }, i * 100);
        } else {
          setTimeout(function () {
            setVisited(visited['row'], visited['col']);
          }, i * 100);
        }
      }
    },
    [setFound, setVisited]
  );

  const bfsHandler = React.useCallback(
    (nodes, sourcePosition, targetPosition) => {
      const nodes_copied = nodes.map((o: any) => [...o]);
      const visitedLog = bfsAlgorithm(
        nodes_copied,
        sourcePosition,
        targetPosition
      );
      applyLog(visitedLog);
    },
    [applyLog]
  );

  const dfsHandler = React.useCallback(
    (nodes, sourcePosition, targetPosition) => {
      const nodes_copied = nodes.map((o: any) => [...o]);
      const visitedLog = dfsAlgorithm(
        nodes_copied,
        sourcePosition,
        targetPosition
      );
      applyLog(visitedLog);
    },
    [applyLog]
  );

  const resetPosition = React.useCallback(() => {
    const deafultPosition = { row: -1, col: -1 };

    setNodes(initCell());

    setSourcePosition(deafultPosition);
    setTargetPosition(deafultPosition);
    setIsSourceSet(false);
    setIsTargetSet(false);
  }, []);

  return (
    <div className="path-page">
      <div className="button-group">
        <Button
          className="bfs-button"
          color="primary"
          variant="contained"
          onClick={() => bfsHandler(nodes, sourcePosition, targetPosition)}
        >
          BFS
        </Button>
        <Button
          className="dfs-button"
          color="primary"
          variant="contained"
          onClick={() => dfsHandler(nodes, sourcePosition, targetPosition)}
        >
          DFS
        </Button>
        <Button
          className="reset-button"
          color="primary"
          variant="contained"
          onClick={() => resetPosition()}
        >
          Reset
        </Button>
      </div>
      <div className="grid">
        {nodes.map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((col, colId) => (
                <Cell
                  key={colId}
                  colVisited={col.visited}
                  colFound={col.found}
                  colSource={col.source}
                  colTarget={col.target}
                  col={col}
                  setNode={setNode}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
