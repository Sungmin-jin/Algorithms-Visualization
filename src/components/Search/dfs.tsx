export function dfsAlgorithm(
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

  const nodeStack = [source];
  const visited = [source];

  const rowPos = [-1, -1, -1, 0, 0, 1, 1, 1];
  const colPos = [-1, 0, 1, -1, 1, -1, 0, 1];

  while (nodeStack.length != 0) {
    const tempNode = nodeStack[nodeStack.length - 1];
    nodeStack.pop();

    const tempRow = tempNode['row'];
    const tempCol = tempNode['col'];

    if (
      tempNode['row'] === targetPosition['row'] &&
      tempNode['col'] === targetPosition['col']
    ) {
      visitedLog.push({
        row: tempNode['row'],
        col: tempNode['col'],
        isTarget: true,
      });

      return visitedLog;
    } else if (visited.indexOf(tempNode) === -1) {
      visited.push(tempNode);

      visitedLog.push({
        row: tempNode['row'],
        col: tempNode['col'],
        isTarget: false,
      });
    }

    for (let i = 0; i < rowPos.length; i++) {
      const newRow = tempRow + rowPos[i];
      const newCol = tempCol + colPos[i];

      if (
        newRow < 0 ||
        newRow >= nodes.length ||
        newCol < 0 ||
        newCol >= nodes.length
      ) {
        continue;
      }

      const neighbor = nodes[newRow][newCol];
      if (visited.indexOf(neighbor) === -1) {
        nodeStack.push(neighbor);
      }
    }
  }
}
