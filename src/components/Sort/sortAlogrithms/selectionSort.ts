const selectionSort = (arr: number[]) => {
  const len = arr.length;
  const indices = [];
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      indices.push(j);
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (min != i) {
      const tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
      indices.push([min, i]);
    }
  }
  return indices;
};

export default selectionSort;
