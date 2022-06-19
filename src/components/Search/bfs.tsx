export function bfsAlgorithm(
  nodes: string | any[],
  sourcePosition: { [x: string]: string | number },
  targetPosition: { [x: string]: any }
) {
  const visitedLog = [];
  if (
    sourcePosition['row'] === targetPosition['row'] &&
    sourcePosition['col'] === targetPosition['col']
  ) {
    visitedLog.push({
      row: sourcePosition['row'],
      col: sourcePosition['col'],
      isTarget: true,
    });
    return visitedLog;
  }
  const source = nodes[sourcePosition['row']][sourcePosition['col']];

  const nodeQueue = [source];
  const visited = [source];

  const rowPos = [0, -1, -1, -1, 0, 0, 1, 1, 1];
  const colPos = [0, -1, 0, 1, -1, 1, -1, 0, 1];

  while (nodeQueue.length) {
    const tempNode = nodeQueue.shift();

    for (let i = 0; i < rowPos.length; i++) {
      const newRow = tempNode['row'] + rowPos[i];
      const newCol = tempNode['col'] + colPos[i];

      if (
        newRow < 0 ||
        newRow >= nodes.length ||
        newCol < 0 ||
        newCol >= nodes.length
      ) {
        continue;
      }

      const neighbor = nodes[newRow][newCol];
      if (
        neighbor['row'] === targetPosition['row'] &&
        neighbor['col'] === targetPosition['col']
      ) {
        visitedLog.push({
          row: neighbor['row'],
          col: neighbor['col'],
          isTarget: true,
        });
        return visitedLog;
      } else if (visited.indexOf(neighbor) === -1) {
        visited.push(neighbor);
        nodeQueue.push(neighbor);

        visitedLog.push({
          row: neighbor['row'],
          col: neighbor['col'],
          isTarget: false,
        });
      }
    }
  }
}
