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
  const copyOffset = dummyNum * itemWidth; // コピーした分のズレ

  useSpyRequestAnimationFrame();
  useSpyPerformanceNow();

  it('初期位置のズレテスト', () => {
    const instance = new Slider();
    instance.onChange = (x, index) => {
      expect(index).toBe(0);
      expect(x).toBe(10 + copyOffset);
    };
    instance.init(width, elementNum, dummyNum, {
      offsetLeft: 10,
    });
  });

  it('Index位置のズレによるテスト', () => {
    const instance = new Slider();
    const offsetIndex = 1;
    instance.onChange = (x, index) => {
      expect(index).toBe(1);
      expect(x).toBe(itemWidth * offsetIndex + copyOffset);
    };
    instance.init(width, elementNum, dummyNum, {
      initialIndex: offsetIndex,
    });
  });

  it('ループのテスト', async () => {
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
      expect(rx).toBe(ri * itemWidth + copyOffset);
    };
    instance.end();
  });
});
