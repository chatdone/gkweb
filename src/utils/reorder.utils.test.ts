import { describe, test } from 'vitest';

import { reorder } from './reorder.utils';

describe('reorder', () => {
  test('it should return a new copy of reorder array', () => {
    const arr = ['first', 'second', 'third'];

    const reordered = reorder(arr, 2, 0);

    expect(reordered).toEqual(['third', 'first', 'second']);
  });
});
