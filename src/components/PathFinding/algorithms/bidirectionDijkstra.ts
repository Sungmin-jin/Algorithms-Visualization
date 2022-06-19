import Heap from 'heap';
import { BlocksType, indexType } from '../PathFindingContext';

type BidirectionDijkstraBlockType = {
  distanceFromStart: number;
  distanceFromEnd: number;
  fromStartVisited?: boolean;
  fromEndVisited?: boolean;
  rowIndex: number;
  colIndex: number;
  fromStartPrev?: BidirectionDijkstraBlockType;
  fromEndPrev?: BidirectionDijkstraBlockType;
  isObstacle: boolean;
};

const buildHeap = (
  blocks: BidirectionDijkstraBlockType[][],
  heap: Heap<BidirectionDijkstraBlockType>
) => {
  blocks.forEach((row) => row.forEach((block) => heap.push(block)));
};

const startHeapCmp = (
  a: BidirectionDijkstraBlockType,
  b: BidirectionDijkstraBlockType
) => a.distanceFromStart - b.distanceFromStart;

const endHeapCmp = (
  a: BidirectionDijkstraBlockType,
  b: BidirectionDijkstraBlockType
) => a.distanceFromEnd - b.distanceFromEnd;

const buildVirtualBlocks = (blocks: BlocksType) =>
  blocks.map((row, rowIndex) =>
    row.map((block, colIndex) => ({
      rowIndex,
      colIndex,
      distanceFromStart: Infinity,
      distanceFromEnd: Infinity,
      isObstacle: block.status === 'obstacle',
    }))
  );

const updateNearBlocksDistance = (
  target: BidirectionDijkstraBlockType,
  blocks: BidirectionDijkstraBlockType[][],
  fromStart: boolean
) => {
  const { rowIndex, colIndex } = target;
  const rowLength = blocks.length;
  const colLength = blocks[0].length;
  const word = fromStart ? 'Start' : 'End';
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (
        (i === 0 && j === 0) ||
        rowIndex + i < 0 ||
        colIndex + j < 0 ||
        rowIndex + i >= rowLength ||
        colIndex + j >= colLength ||
        blocks[rowIndex + i][colIndex + j][`from${word}Visited`]
      )
        continue;
      const isDiagonal = Math.abs(i) + Math.abs(j) === 2;
      if (
        isDiagonal &&
        blocks[rowIndex][colIndex + j].isObstacle &&
        blocks[rowIndex + i][colIndex].isObstacle
      ) {
        continue;
      }
      const neighborBlock = blocks[rowIndex + i][colIndex + j];
      const addingDistance =
        target[`distanceFrom${word}`] + (isDiagonal ? 1.4 : 1);
      if (addingDistance < neighborBlock[`distanceFrom${word}`]) {
        neighborBlock[`distanceFrom${word}`] = addingDistance;
        neighborBlock[`from${word}Prev`] = target;
      }
    }
  }
};

const getPath = (targetBlock: BidirectionDijkstraBlockType) => {
  const startPath = [];
  const endPath = [];
  let startNode = targetBlock;
  let endNode = targetBlock;
  while (startNode.fromStartPrev) {
    startPath.push(startNode);
    startNode = startNode.fromStartPrev;
  }

  while (endNode.fromEndPrev) {
    if (targetBlock !== endNode) {
      endPath.push(endNode);
    }
    endNode = endNode.fromEndPrev;
  }

  return startPath.reverse().concat(endPath);
};

const bidirectionDijkstra = (
  blocks: BlocksType,
  startPoint: indexType,
  endPoint: indexType
) => {
  const startTime = performance.now();
  const visitedBlocksFromStart = [];
  const visitedBlocksFromEnd = [];
  const noWayFromStart = false;
  const noWayFromEnd = false;
  const virtualBlocks = buildVirtualBlocks(blocks);
  virtualBlocks[startPoint.rowIndex][startPoint.colIndex].distanceFromStart = 0;
  virtualBlocks[endPoint.rowIndex][endPoint.colIndex].distanceFromEnd = 0;
  const startHeap = new Heap(startHeapCmp);
  const endHeap = new Heap(endHeapCmp);
  buildHeap(virtualBlocks, startHeap);
  buildHeap(virtualBlocks, endHeap);

  while (
    !startHeap.empty() ||
    (!endHeap.empty() && !(noWayFromEnd || noWayFromStart))
  ) {
    const closestBlockFromStart = startHeap.pop();
    const closestBlockFromEnd = endHeap.pop();
    if (
      closestBlockFromEnd.fromStartVisited ||
      closestBlockFromStart.fromEndVisited
    ) {
      visitedBlocksFromStart.push(closestBlockFromStart);
      visitedBlocksFromEnd.push(closestBlockFromEnd);
      return {
        visitedBlocksFromStart,
        visitedBlocksFromEnd,
        duration: performance.now() - startTime,
        path: getPath(
          closestBlockFromEnd.fromStartVisited
            ? closestBlockFromEnd
            : closestBlockFromStart
        ),
      };
    }
    if (
      closestBlockFromStart.distanceFromStart === Infinity ||
      closestBlockFromEnd.distanceFromEnd === Infinity
    ) {
      visitedBlocksFromStart.push(closestBlockFromStart);
      visitedBlocksFromEnd.push(closestBlockFromEnd);
      return {
        visitedBlocksFromStart,
        visitedBlocksFromEnd,
        duration: performance.now() - startTime,
        path: [],
      };
    }

    if (closestBlockFromStart && !closestBlockFromStart.isObstacle) {
      closestBlockFromStart.fromStartVisited = true;
      visitedBlocksFromStart.push(closestBlockFromStart);
      updateNearBlocksDistance(closestBlockFromStart, virtualBlocks, true);
      startHeap.heapify();
    }

    if (closestBlockFromEnd && !closestBlockFromEnd.isObstacle) {
      closestBlockFromEnd.fromEndVisited = true;
      visitedBlocksFromEnd.push(closestBlockFromEnd);
      updateNearBlocksDistance(closestBlockFromEnd, virtualBlocks, false);
      endHeap.heapify();
    }
  }
  return {
    visitedBlocksFromStart,
    visitedBlocksFromEnd,
    duration: performance.now() - startTime,
    path: [],
  };
};

export default bidirectionDijkstra;
