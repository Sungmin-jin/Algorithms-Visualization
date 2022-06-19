const doQuickSort = (
  arr: number[],
  start: number,
  end: number,
  indices: (number[] | number)[]
) => {
  if (start >= end) {
    return;
  }

  const key = start;
  let i = start + 1;
  let j = end;
  let tmp;

  while (i <= j) {
    while (arr[i] <= arr[key]) {
      indices.push(i);
      i++;
    }
    while (arr[j] >= arr[key] && j > start) {
      indices.push(j);
      j--;
    }
    if (i > j) {
      tmp = arr[j];
      arr[j] = arr[key];
      arr[key] = tmp;
      indices.push([j, key]);
    } else {
      tmp = arr[j];
      arr[j] = arr[i];
      arr[i] = tmp;
      indices.push([j, i]);
    }
  }

  doQuickSort(arr, start, j - 1, indices);
  doQuickSort(arr, j + 1, end, indices);
};

const quickSort = (arr: number[]) => {
  const indices: (number | number[])[] = [];
  doQuickSort(arr, 0, arr.length - 1, indices);
  return indices;
};

export default quickSort;
