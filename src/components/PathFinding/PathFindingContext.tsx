import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import { astar, dijkstra, bidirectionDijkstra } from './algorithms';

// type PathFindingContextValue = any;

type PathFindingContextProvider = {
  children: React.ReactNode;
};

export type BlockStatusType = 'obstacle' | 'start' | 'end' | 'visited' | 'path';

export type indexType = {
  rowIndex: number;
  colIndex: number;
};

export type BlockType = {
  status?: BlockStatusType;
};

export type BlocksType = BlockType[][];

export type GridType = {
  row: number;
  col: number;
};

export enum AlgorithmOptions {
  Dijkstra = 'dijkstra',
  AStar = 'astar',
  BidirectionDijkstra = 'bidirectionDijkstra',
}

type PathFindingContextValue = {
  blocks: BlocksType;
  gridSize: GridType;
  startPoint?: indexType;
  endPoint?: indexType;
  chosenAlgorithm: React.MutableRefObject<AlgorithmOptions>;
  gridContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  durationTime: number;
  updateBlockStatus: (
    rowIndex: number,
    colIndex: number,
    updateBlockType?: BlockStatusType
  ) => void;
  setGridSize: React.Dispatch<React.SetStateAction<GridType>>;
  mouseEnterEventHandler: (rowIndex: number, colIndex: number) => void;
  mouseDownEventHandler: (rowIndex: number, colIndex: number) => void;
  mouseUpEventHandler: () => void;
  findPath: () => void;
  initializeBlocks: () => void;
  onChangeAlgorithm: (selectedAlgorithm: AlgorithmOptions) => void;
  isRunning: boolean;
};

const PathFindingContext = createContext<PathFindingContextValue | undefined>(
  undefined
);

export const usePathFindingContext = () => {
  const pathFindingContext = useContext(PathFindingContext);
  if (pathFindingContext === undefined) {
    throw Error(
      'usePathFindingContext must be used within a pathFindingContextProvider'
    );
  }
  return pathFindingContext;
};

export const PathFindingContextProvider: React.FC<PathFindingContextProvider> = ({
  children,
}) => {
  const [startPoint, setStartPoint] = useState<indexType | undefined>();
  const [endPoint, setEndPoint] = useState<indexType | undefined>();
  const [gridSize, setGridSize] = useState<GridType>({ row: 0, col: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const chosenAlgorithm = useRef<AlgorithmOptions>(AlgorithmOptions.Dijkstra);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [durationTime, setDurationTime] = useState(0);
  const isRunning = useRef(false);

  const generateInitialBlock = useCallback(
    () =>
      new Array(gridSize.row).fill(
        new Array(gridSize.col).fill({ status: undefined })
      ),
    [gridSize]
  );

  const [blocks, setBlocks] = useState<BlocksType>(generateInitialBlock());

  const onChangeAlgorithm = useCallback(
    (selectedAlgorithm: AlgorithmOptions) => {
      chosenAlgorithm.current = selectedAlgorithm;
    },
    []
  );

  const initializeBlocks = useCallback(() => {
    if (isRunning.current) return;
    setBlocks(generateInitialBlock);
    setStartPoint(undefined);
    setEndPoint(undefined);
    setDurationTime(0);
  }, [generateInitialBlock, setBlocks, isRunning]);

  useEffect(() => {
    if (gridSize.row === blocks.length && gridSize.col === blocks[0]?.length)
      return;
    initializeBlocks();
  }, [gridSize]);

  const updateBlockStatus = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      updateBlockStatus?: BlockStatusType
    ) => {
      let status = updateBlockStatus;
      setBlocks((prev) => {
        return prev.map((row, rIndex) =>
          row.map((block, cIndex) => {
            if (rowIndex === rIndex && colIndex === cIndex) {
              if (block.status === 'start' || block.status === 'end')
                return block;

              if (!startPoint) {
                setStartPoint({ rowIndex, colIndex });
                status = 'start';
              } else if (!endPoint) {
                setEndPoint({ rowIndex, colIndex });
                status = 'end';
              }
              return { ...block, status };
            }
            return block;
          })
        );
      });
    },
    [startPoint, endPoint, isRunning]
  );

  const resetExceptStartAndEnd = () => {
    setBlocks((prev) =>
      prev.map((row) =>
        row.map((block) => {
          if (
            block.status === 'end' ||
            block.status === 'start' ||
            block.status === 'obstacle'
          )
            return block;
          return { ...block, status: undefined };
        })
      )
    );
  };

  const mouseDownEventHandler = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!startPoint || !endPoint || !blocks) return;
      if (
        (startPoint.rowIndex === rowIndex &&
          startPoint.colIndex === colIndex) ||
        (endPoint.rowIndex === rowIndex && endPoint.colIndex === colIndex)
      )
        return;
      if (isRunning.current) return;

      setIsMouseDown(true);
      if (blocks[rowIndex][colIndex].status === 'obstacle') return;
      updateBlockStatus(rowIndex, colIndex, 'obstacle');
    },
    // todo dependency should have blocks but it causes bunch of rerender fix it later
    [startPoint, endPoint, isRunning]
  );

  const mouseEnterEventHandler = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!isMouseDown) return;
      updateBlockStatus(rowIndex, colIndex, 'obstacle');
    },
    [isMouseDown]
  );

  const mouseUpEventHandler = useCallback(() => {
    if (isMouseDown) setIsMouseDown(false);
  }, [isMouseDown]);
  const findPath = () => {
    if (!startPoint || !endPoint) {
      return;
    }
    if (isRunning.current) {
      return;
    }
    resetExceptStartAndEnd();
    isRunning.current = true;
    let visitedBlocks: indexType[];
    let path: indexType[];
    let duration;
    if (chosenAlgorithm.current === AlgorithmOptions.Dijkstra) {
      ({ visitedBlocks, path, duration } = dijkstra(
        blocks,
        startPoint,
        endPoint
      ));
    } else if (chosenAlgorithm.current === AlgorithmOptions.AStar) {
      ({ visitedBlocks, path, duration } = astar(blocks, startPoint, endPoint));
    } else {
      const {
        visitedBlocksFromStart,
        visitedBlocksFromEnd,
        duration,
        path,
      } = bidirectionDijkstra(blocks, startPoint, endPoint);
      let i = 0;
      while (
        i < visitedBlocksFromEnd.length - 1 ||
        i < visitedBlocksFromStart.length - 1
      ) {
        const index = i;
        setTimeout(() => {
          if (visitedBlocksFromStart.length - 1 > index) {
            updateBlockStatus(
              visitedBlocksFromStart[index].rowIndex,
              visitedBlocksFromStart[index].colIndex,
              'visited'
            );
          }
          if (visitedBlocksFromEnd.length - 1 > index) {
            updateBlockStatus(
              visitedBlocksFromEnd[index].rowIndex,
              visitedBlocksFromEnd[index].colIndex,
              'visited'
            );
          }
          if (visitedBlocksFromStart.length - 2 === index) {
            if (!path || path.length === 0) {
              isRunning.current = false;
            }
            for (let i = 0; i < path.length; i++) {
              setTimeout(() => {
                updateBlockStatus(path[i].rowIndex, path[i].colIndex, 'path');
                if (i === path.length - 1) isRunning.current = false;
              }, 50 * i);
            }
          }
        }, 15 * i);

        i++;
      }
      setDurationTime(Math.round((duration + Number.EPSILON) * 10000) / 10000);

      return;
    }
    setDurationTime(Math.round((duration + Number.EPSILON) * 10000) / 10000);
    for (let i = 0; i < visitedBlocks.length; i++) {
      setTimeout(() => {
        updateBlockStatus(
          visitedBlocks[i].rowIndex,
          visitedBlocks[i].colIndex,
          'visited'
        );
        if (i === visitedBlocks.length - 1) {
          if (!path || path.length === 0) {
            isRunning.current = false;
            return;
          }
          for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
              updateBlockStatus(path[i].rowIndex, path[i].colIndex, 'path');
              if (i === path.length - 1) isRunning.current = false;
            }, 50 * i);
          }
        }
      }, 15 * i);
    }
  };
  return (
    <PathFindingContext.Provider
      value={{
        setGridSize,
        updateBlockStatus,
        mouseEnterEventHandler,
        mouseDownEventHandler,
        mouseUpEventHandler,
        findPath,
        initializeBlocks,
        onChangeAlgorithm,
        gridContainerRef,
        chosenAlgorithm,
        blocks,
        gridSize,
        startPoint,
        endPoint,
        durationTime,
        isRunning: isRunning.current,
      }}
    >
      {children}
    </PathFindingContext.Provider>
  );
};
