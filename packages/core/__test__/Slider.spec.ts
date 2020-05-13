import { Slider } from '../lib/Slider'
import { useSpyRequestAnimationFrame, useSpyPerformanceNow } from './util/index';

requestAnimationFrame(() => {
  console.log('hoge');
})
describe('increments value on click', () => {
  const itemWidth = 100;
  const elementNum = 5;
  const dummyNum = 2;
  const width = itemWidth * (elementNum + dummyNum * 2);
  const offset = -(itemWidth * dummyNum);


  useSpyRequestAnimationFrame();
  useSpyPerformanceNow();

  it('offset test', () => {
    const instance = new Slider();
    instance.onChange = (x, index) => {
      expect(index).toBe(0);
      expect(x).toBe(10 + offset);
    };
    instance.init(width, elementNum, dummyNum, {
      offsetLeft: 10,
    });
  });

  it('initial index test', () => {
    const instance = new Slider();
    const offsetIndex = 1;
    instance.onChange = (x, index) => {
      expect(index).toBe(1);
      expect(x).toBe(-itemWidth + offset);
    };
    instance.init(width, elementNum, dummyNum, {
      initialIndex: offsetIndex,
    });
  });

  it('fitting loop test', async () => {
    const width = itemWidth * (elementNum + dummyNum * 2)
    const instance = new Slider();
    instance.init(width, elementNum, dummyNum, {
      isFit: true,
      isLoop: true,
    });
    let rx = 0;
    let ri = 0;
    instance.onChange = (x, index) => {
      rx = x;
      ri = index;
    };

    instance.start(5);
    instance.update(-100);
    instance.update(-200);

    instance.onEnd = () => {
      expect(rx).toBe(-ri * itemWidth + offset);
    };
    instance.end();

    instance.start(5);
    instance.update(-500);
    instance.update(-1000);
    instance.onEnd = () => {
      expect(rx).toBe(-ri * itemWidth + offset);
    };
    instance.end();
  });
});
