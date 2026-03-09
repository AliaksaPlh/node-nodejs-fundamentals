/**
 * Split the array into N chunks
 * @param {Array<number>} arr
 * @param {number} num
 * @returns {Array<Array<number>>}
 */
export const splitIntoChunks = (arr, num) => {
  if (num <= 0) return [arr];
  const chunks = Array.from({ length: num }, () => []);
  arr.forEach((value, index) => {
    chunks[index % num].push(value);
  });
  return chunks;
};

/**
 * Min-heap for k-way merge.
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node) {
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].value <= this.heap[i].value) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _bubbleDown(i) {
    const len = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < len && this.heap[left].value < this.heap[smallest].value)
        smallest = left;
      if (right < len && this.heap[right].value < this.heap[smallest].value)
        smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

/**
 * Merge the sorted chunks into a single sorted array (using k-way merge algorithm)
 * @param {Array<Array<number>>} sortedChunks
 * @returns {Array<number>}
 */
export const kWayMerge = (sortedChunks) => {
  const heap = new MinHeap();
  sortedChunks.forEach((chunk, arrayIndex) => {
    if (chunk.length > 0) {
      heap.push({ value: chunk[0], arrayIndex, elementIndex: 0 });
    }
  });

  const result = [];
  while (!heap.isEmpty()) {
    const { value, arrayIndex, elementIndex } = heap.pop();
    result.push(value);
    const chunk = sortedChunks[arrayIndex];
    const nextIndex = elementIndex + 1;
    if (nextIndex < chunk.length) {
      heap.push({
        value: chunk[nextIndex],
        arrayIndex,
        elementIndex: nextIndex,
      });
    }
  }
  return result;
};
