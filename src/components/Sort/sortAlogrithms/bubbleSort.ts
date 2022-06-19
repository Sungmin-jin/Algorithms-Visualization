const bubbleSort = (arr: number[]) => {
  const len = arr.length;
  const indices = [];
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      indices.push(j);
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        indices.push([j, j + 1]);
      }
    }
  }
  return indices;
};

export default bubbleSort;
