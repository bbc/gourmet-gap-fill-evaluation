import { timeElapsed } from '../evaluation';

describe('timeElapsed', () => {
  test('should return 0 if passed NaN', () => {
    expect(timeElapsed(NaN)).toEqual(0);
  });

  test('should return the difference between time stamp and current time', () => {
    expect(timeElapsed(5, 10)).toEqual(5);
  });
});
