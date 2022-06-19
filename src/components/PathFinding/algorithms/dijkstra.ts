import Heap from 'heap';
import { BlockType, indexType, BlocksType } from '../PathFindingContext';

type DijkstraBlockType = {
  distance: number;
  rowIndex: number;
  colIndex: number;
  isVisited: boolean;
  isObstacle: boolean;
  prev?: DijkstraBlockType;
};

type DijkstraBlocksType = DijkstraBlockType[][];

const cmpHeap = (a: DijkstraBlockType, b: DijkstraBlockType) =>
  a.distance - b.distance;

const buildHeap = (blocks: DijkstraBlocksType) => {
  const heap = new Heap(cmpHeap);
  blocks.forEach((row) => row.forEach((block) => heap.push(block)));
  return heap;
};

const buildVirtualBlocks = (blocks: BlockType[][]): DijkstraBlocksType =>
  blocks.map((row, rowIndex) =>
    row.map((block, colIndex) => ({
      rowIndex,
      colIndex,
      isVisited: false,
      distance: Infinity,
      prev: undefined,
      isObstacle: block.status === 'obstacle',
    }))
  );

const updateNearBlocksDistance = (
  target: DijkstraBlockType,
  blocks: DijkstraBlocksType
) => {
  const { rowIndex, colIndex } = target;
  const rowLength = blocks.length;
  const colLength = blocks[0].length;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (
        (i === 0 && j === 0) ||
        rowIndex + i < 0 ||
        colIndex + j < 0 ||
        rowIndex + i >= rowLength ||
        colIndex + j >= colLength ||
        blocks[rowIndex + i][colIndex + j].isVisited
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
      const addingDistance = target.distance + (isDiagonal ? 1.4 : 1);
      if (addingDistance < neighborBlock.distance) {
        neighborBlock.distance = addingDistance;
        neighborBlock.prev = target;
      }
    }
  }
};

const getPath = (destination: DijkstraBlockType) => {
  let node = destination;
  const path = [];
  while (node.prev) {
    path.push(node);
    node = node.prev;
  }
  return path.reverse();
};

const dijkstra = (
  blocks: BlocksType,
  startPoint: indexType,
  endPoint: indexType
): {
  visitedBlocks: DijkstraBlockType[];
  path: DijkstraBlockType[];
  duration: number;
} => {
  const startTime = performance.now();
  const visitedBlocks = [];
  const virtualBlocks = buildVirtualBlocks(blocks);
  virtualBlocks[startPoint.rowIndex][startPoint.colIndex].distance = 0;
  virtualBlocks[startPoint.rowIndex][startPoint.colIndex].isVisited = true;
  const blockHeap = buildHeap(virtualBlocks);
  while (!blockHeap.empty()) {
    const closestBlock = blockHeap.pop();
    if (closestBlock.isObstacle) continue;
    if (closestBlock.distance === Infinity) {
      return {
        visitedBlocks,
        path: [],
        duration: performance.now() - startTime,
      };
    }
    closestBlock.isVisited = true;
    visitedBlocks.push(closestBlock);
    if (
      closestBlock.rowIndex === endPoint.rowIndex &&
      closestBlock.colIndex === endPoint.colIndex
    ) {
      return {
        visitedBlocks,
        path: getPath(closestBlock),
        duration: performance.now() - startTime,
      };
    }
    updateNearBlocksDistance(closestBlock, virtualBlocks);
    blockHeap.heapify();
  }
  return { visitedBlocks, path: [], duration: performance.now() - startTime };
};

export default dijkstra;
