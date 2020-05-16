import { Slider } from '../lib/Slider'
import { useSpyRequestAnimationFrame, useSpyPerformanceNow } from './util/index';

const itemWidth = 100;
const elementNum = 5;
const dummyNum = 2;
const width = itemWidth * (elementNum + dummyNum * 2);
const copyOffset = dummyNum * itemWidth; // コピーした分のズレ
useSpyRequestAnimationFrame();
useSpyPerformanceNow();

describe('基本動作テスト', () => {

  it('offset初期位置ズレのテスト', () => {
    const instance = new Slider();
    instance.onChange = (x, index) => {
      expect(index).toBe(0);
      expect(x).toBe(10 + copyOffset);
    };
    instance.init(width, elementNum, dummyNum, {
      offsetLeft: 10,
    });
  });

  it('Index初期位置ズレのテスト', () => {
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

  it('ループのテスト:スナップショット', () => {
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
    instance.onEnd = () => {
      expect(rx).toBe(ri * itemWidth + copyOffset);
      expect(JSON.stringify(logList, null, 2)).toMatchSnapshot();
    };
    instance.end();

    instance.start(5);
    instance.update(100);
    instance.update(400);
    instance.onEnd = () => {
      expect(rx).toBe(ri * itemWidth + copyOffset);
      expect(JSON.stringify(logList, null, 2)).toMatchSnapshot();
    };
    instance.end();
  });

  it('非ループのテスト:スナップショット', () => {
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
      isLoop: false,
    });
    instance.onEnd = () => {
      expect(rx).toBe(ri * itemWidth + copyOffset);
      expect(JSON.stringify(logList, null, 2)).toMatchSnapshot();
    };
    instance.start(5);
    instance.update(-50);
    instance.update(-100);
    instance.end();

    instance.onEnd = () => {
      expect(rx).toBe(ri * itemWidth + copyOffset);
      expect(JSON.stringify(logList, null, 2)).toMatchSnapshot();
    };
    instance.start(5);
    instance.update(50);
    instance.update(100);
    instance.end();
  });

  it('限界値テスト', () => {
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

  it('インデックス移動テスト', () => {
    const instance = new Slider();
    instance.init(width, elementNum, dummyNum);
    const testIndex = (index: number) => {
      let rx = 0;
      let ri = 0;
      instance.onChange = (x, i) => {
        rx = x;
        ri = i;
      };
      instance.onEnd = () => {
        expect(ri).toBe(index);
      };
      instance.setIndex(index);
    };
    const testIndexList = [0,1,2,3,4,5];

    testIndexList.sort(() => Math.random() - 0.5);
    testIndexList.forEach((i) => {
      testIndex(i);
    });

    testIndexList.sort(() => Math.random() - 0.5);
    testIndexList.forEach((i) => {
      testIndex(i);
    })
  });
});
