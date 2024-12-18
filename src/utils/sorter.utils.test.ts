import { describe, test } from 'vitest';

import { alphabeticalSort, countSort } from './sorter.utils';

describe('alphabeticalSort', () => {
  test('it should sort alphabetically', () => {
    const arrayToSort = [{ name: 'z' }, { name: 'a' }];

    arrayToSort.sort(alphabeticalSort('name'));

    expect(arrayToSort[0].name).toBe('a');
    expect(arrayToSort[1].name).toBe('z');
  });

  test('it should able to sort even with empty string', () => {
    const arrayToSort = [{ name: 'a' }, { name: '' }, { name: 'b' }];

    arrayToSort.sort(alphabeticalSort('name'));

    expect(arrayToSort[0].name).toBe('a');
    expect(arrayToSort[1].name).toBe('b');
    expect(arrayToSort[2].name).toBe('');
  });

  test('it should able to sort even with undefined value', () => {
    const arrayToSort = [{ name: 'a' }, { name: undefined }];

    arrayToSort.sort(alphabeticalSort('name'));

    expect(arrayToSort[0].name).toBe('a');
    expect(arrayToSort[1].name).not.toBeDefined();
  });
});

describe('countSort', () => {
  test('it should sort value with string input', () => {
    const arrayToSort = [{ value: 10 }, { value: 1 }];

    arrayToSort.sort(countSort('value'));

    expect(arrayToSort[0].value).toBe(1);
    expect(arrayToSort[1].value).toBe(10);
  });

  test('it should sort value with function input', () => {
    const arrayToSort = [{ value: 10 }, { value: 1 }];

    arrayToSort.sort(countSort((input) => input.value));

    expect(arrayToSort[0].value).toBe(1);
    expect(arrayToSort[1].value).toBe(10);
  });
});
