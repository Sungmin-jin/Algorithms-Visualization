const insertionSort = (arr: number[]) => {
  const len = arr.length;
  const indices = [];
  for (let i = 0; i < len - 1; i++) {
    let j = i;
    while (arr[j] > arr[j + 1]) {
      indices.push(j);
      indices.push([j, j + 1]);
      const temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
      j--;
    }
  }
  return indices;
};

export default insertionSort;
