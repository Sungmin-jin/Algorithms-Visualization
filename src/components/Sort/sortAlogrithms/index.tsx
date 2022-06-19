import bubbleSort from './bubbleSort';
import selectionSort from './selectionSort';
import insertionSort from './insertionSort';
import quickSort from './quickSort';
import mergeSort from './mergeSort';
import { SortMethods } from '../types';

export const sortMap: Record<
  SortMethods,
  (arr: number[]) => (number[] | number)[]
> = {
  [SortMethods.Bubble]: bubbleSort,
  [SortMethods.Selection]: selectionSort,
  [SortMethods.Insertion]: insertionSort,
  [SortMethods.Quick]: quickSort,
  [SortMethods.Merge]: mergeSort,
};
