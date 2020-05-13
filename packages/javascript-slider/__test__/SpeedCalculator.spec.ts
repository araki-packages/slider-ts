import { SpeedCalculator } from '../lib/SpeedCalculator'

describe('increments value on click', () => {
  it('initial state', () => {
    const instance = new SpeedCalculator(10);
    expect(instance.get()).toBe(0);
  });

  it('add scala state', () => {
    const instance = new SpeedCalculator(10);
    instance.add(10);
    expect(instance.get()).toBe(10);
  });

  it('add list test', () => {
    const instance = new SpeedCalculator(10);
    const testArray = [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    testArray.forEach((val) => {
      instance.add(val);
      expect(instance.get()).toBe(10);
    });
  });

  it('division test', () => {
    const instance = new SpeedCalculator(10);
    const testArray = [ 0, 10 ];
    testArray.forEach((val) => {
      instance.add(val);
    });
    expect(instance.get()).toBe(5);
  });
});
