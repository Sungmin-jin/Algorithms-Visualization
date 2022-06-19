const merge = (
  arr: number[],
  m: number,
  middle: number,
  n: number,
  indices: (number | number[])[],
  sorted: number[]
) => {
  let i = m;
  let j = middle + 1;
  let k = m;
  while (i <= middle && j <= n) {
    indices.push(i);
    indices.push(j);
    if (arr[i] <= arr[j]) {
      sorted[k] = arr[i];
      indices.push([k, arr[i]]);
      i++;
    } else {
      sorted[k] = arr[j];
      indices.push([k, arr[j]]);
      j++;
    }
    k++;
  }
  if (i > middle) {
    indices.push(i);
    for (let t = j; t <= n; t++) {
      sorted[k] = arr[t];
      indices.push([k, arr[t]]);
      k++;
    }
  } else {
    indices.push(j);
    for (let t = i; t <= middle; t++) {
      sorted[k] = arr[t];
      indices.push([k, arr[t]]);
      k++;
    }
  }
  for (let t = m; t <= n; t++) {
    arr[t] = sorted[t];
  }
};

const doMergeSort = (
  arr: number[],
  m: number,
  n: number,
  indices: (number[] | number)[],
  sorted: number[]
) => {
  if (m < n) {
    const middle = Math.floor((m + n) / 2);
    doMergeSort(arr, m, middle, indices, sorted);
    doMergeSort(arr, middle + 1, n, indices, sorted);
    merge(arr, m, middle, n, indices, sorted);
  }
};

const mergeSort = (arr: number[]) => {
  const indices: number[] = [];
  const sorted = [...arr];
  doMergeSort(arr, 0, arr.length - 1, indices, sorted);
  return indices;
};

export default mergeSort;
