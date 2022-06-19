import Heap from 'heap';
import { BlocksType, indexType } from '../PathFindingContext';

type AStarBlockType = {
  gCost: number;
  hCost: number;
  fCost: number;
  isVisited: boolean;
  rowIndex: number;
  colIndex: number;
  prev?: AStarBlockType;
  isObstacle: boolean;
};

type AStarBlocksType = AStarBlockType[][];

const cmpHeap = (a: AStarBlockType, b: AStarBlockType) => a.fCost - b.fCost;

const buildHeap = (blocks: AStarBlocksType) => {
  const heap = new Heap(cmpHeap);
  blocks.forEach((row) => row.forEach((block) => heap.push(block)));
  return heap;
};

const buildVirtualBlocks = (blocks: BlocksType) =>
  blocks.map((row, rowIndex) =>
    row.map((block, colIndex) => ({
      rowIndex,
      colIndex,
      isVisited: false,
      isObstacle: block.status === 'obstacle',
      gCost: Infinity,
      hCost: Infinity,
      fCost: Infinity,
      prev: undefined,
    }))
  );

const manhatten = (dx: number, dy: number) => dx + dy;

const updateNeighborBlocksCost = (
  target: AStarBlockType,
  blocks: AStarBlocksType,
  startPoint: indexType,
  endPoint: indexType
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

      const rIndex = rowIndex + i;
      const cIndex = colIndex + j;
      const neighborBlock = blocks[rIndex][cIndex];
      const gCost = target.gCost + (isDiagonal ? 1.4 : 1);

      const hCost = manhatten(
        Math.abs(rIndex - endPoint.rowIndex),
        Math.abs(cIndex - endPoint.colIndex)
      );
      const fCost = gCost + hCost;
      if (neighborBlock.fCost > fCost) {
        neighborBlock.fCost = fCost;
        neighborBlock.gCost = gCost;
        neighborBlock.prev = target;
      }
    }
  }
};

const getPath = (destination: AStarBlockType) => {
  let node = destination;
  const path = [];
  while (node.prev) {
    path.push(node);
    node = node.prev;
  }
  return path.reverse();
};

const astar = (
  blocks: BlocksType,
  startPoint: indexType,
  endPoint: indexType
): {
  visitedBlocks: AStarBlockType[];
  path: AStarBlockType[];
  duration: number;
} => {
  const startTime = performance.now();
  const visitedBlocks = [];
  const virtualBlocks = buildVirtualBlocks(blocks);
  virtualBlocks[startPoint.rowIndex][startPoint.colIndex].fCost = 0;
  virtualBlocks[startPoint.rowIndex][startPoint.colIndex].gCost = 0;
  const blockHeap = buildHeap(virtualBlocks);
  while (!blockHeap.empty()) {
    const smallestGCostBlock = blockHeap.pop();
    if (smallestGCostBlock.isObstacle) continue;
    if (smallestGCostBlock.fCost === Infinity)
      return {
        visitedBlocks,
        path: [],
        duration: performance.now() - startTime,
      };

    smallestGCostBlock.isVisited = true;
    visitedBlocks.push(smallestGCostBlock);
    if (
      smallestGCostBlock.rowIndex === endPoint.rowIndex &&
      smallestGCostBlock.colIndex === endPoint.colIndex
    )
      return {
        visitedBlocks,
        path: getPath(smallestGCostBlock),
        duration: performance.now() - startTime,
      };

    updateNeighborBlocksCost(
      smallestGCostBlock,
      virtualBlocks,
      startPoint,
      endPoint
    );
    blockHeap.heapify();
  }
  return { visitedBlocks, path: [], duration: performance.now() - startTime };
};

export default astar;
