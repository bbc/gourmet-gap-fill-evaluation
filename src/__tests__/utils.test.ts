import {
  convertColonSeparatedStringToList,
  convertListToColonSeparatedString,
} from '../utils';

describe('convertColonSeparatedStringToList', () => {
  test('should return an empty list if given an empty string', () => {
    expect(convertColonSeparatedStringToList('')).toEqual([]);
  });

  test('should return a list of length 1 if no colons in string', () => {
    expect(convertColonSeparatedStringToList('test')).toEqual(['test']);
  });

  test('should return a list of length 2 if 1 colon in string', () => {
    expect(convertColonSeparatedStringToList('1:2')).toEqual(['1', '2']);
  });
});

describe('convertListToColonSeparatedString', () => {
  test('should correctly concatenate the list', () => {
    expect(convertListToColonSeparatedString(['a', 'b'])).toEqual('a:b');
  });

  test('should return an empty string if given an empty list', () => {
    expect(convertListToColonSeparatedString([])).toEqual('');
  });

  test('should not include colons if the list only has 1 item', () => {
    expect(convertListToColonSeparatedString(['1'])).toEqual('1');
  });
});
