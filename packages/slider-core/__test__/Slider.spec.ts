import path from 'path';

import { Slider } from '../lib/Slider'
import { useSpyRequestAnimationFrame, useSpyPerformanceNow } from './util/index';

const LOG_DIR = path.resolve(__dirname, 'SliderLog');
const LOG_FILE = {
  MOVEMENT_DIFF: path.resolve(LOG_DIR, 'movement_diff.json')
}

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

  it('ループのテスト:スナップショット', async () => {
    const width = itemWidth * (elementNum + dummyNum * 2)
    const instance = new Slider();
    let rx = 0;
    let ri = 0;
    const logList: {x: number, i: number}[] = [];

    instance.onChange = (x, i) => {
      logList.push({x, i});
      rx = x;
      ri = i;
    };
    instance.init(width, elementNum, dummyNum, {
      isFit: true,
      isLoop: true,
    });
    instance.start(5);
    instance.update(-100);
    instance.update(-400);
    instance.onEnd = async () => {
      expect(rx).toBe(ri * itemWidth + copyOffset);
      expect(JSON.stringify(logList, null, 2)).toMatchSnapshot();
    };
    instance.end();
  });

  it('しきい値テスト', async () => {
    const width = itemWidth * (elementNum + dummyNum * 2)
    const instance = new Slider();
    let rx = 0;
    let ri = 0;
    const logList: {x: number, i: number}[] = [];

    instance.onChange = (x, i) => {
      logList.push({x, i});
      rx = x;
      ri = i;
      expect(x).toBeGreaterThanOrEqual(copyOffset);
      expect(x).toBeLessThanOrEqual(elementNum * itemWidth + copyOffset + 1);
    };
    instance.init(width, elementNum, dummyNum, {
      isLoop: true,
    });
    const updateLoaction = () => {
      instance.start(5);
      instance.update(-100);
      instance.update(-400);
      instance.end();
      instance.start(5);
      instance.update(100);
      instance.update(400);
      instance.end();
    };
    updateLoaction();
    instance.init(width, elementNum, dummyNum, {
      isLoop: false,
    });
    updateLoaction();

  });
});
