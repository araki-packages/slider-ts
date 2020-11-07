import { Slider } from "../lib/Slider";
import { useSpyRequestAnimationFrame, useSpyPerformanceNow } from "./util";

class SliderLogger {
  private list: Array<{ x: number; i: number }> = [];

  public add(x: number, i: number): void {
    this.list.push({ x, i });
  }

  public clear(): void {
    this.list = [];
  }

  public toCSV(): string {
    const table = "'position', 'index'";
    const record = this.list.map(({ x, i }) => `${x}, ${i}`).join("\n");

    return `${table}\n${record}`;
  }
}

const itemWidth = 100;
const elementNum = 5;
const initialWidth = itemWidth * elementNum;
// const maxWidth = itemWidth * elementNum;
useSpyRequestAnimationFrame();
useSpyPerformanceNow();

describe("基本動作テスト", () => {
  it("Index初期位置ズレのテスト", () => {
    const instance = new Slider();
    const offsetIndex = 1;
    instance.onChange = (x, index) => {
      expect(index).toBe(1);
      expect(x).toBe(itemWidth * offsetIndex);
    };
    instance.init(initialWidth, elementNum, {
      initialIndex: offsetIndex,
      smooth: 0.1,
    });
  });

  it("ループのテスト:スナップショット", () => {
    const width = itemWidth * elementNum;
    const instance = new Slider();
    const logList = new SliderLogger();

    instance.onChange = (x, i) => {
      logList.add(x, i);
    };

    instance.init(width, elementNum, {
      isFit: true,
      isLoop: true,
      smooth: 0.1,
    });
    instance.onEnd = () => {
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };
    instance.start(5);
    instance.update(-100);
    instance.update(-400);
    instance.end();
    instance.start(5);
    instance.update(100);
    instance.update(400);
    instance.end();
  });

  it("非ループのテスト:スナップショット", () => {
    const instance = new Slider();
    let rx = 0;
    let ri = 0;
    const logList = new SliderLogger();

    instance.onChange = (x, i) => {
      logList.add(x, i);
      rx = x;
      ri = i;
    };
    instance.init(initialWidth, elementNum, {
      isFit: true,
      isLoop: false,
      smooth: 0.1,
    });
    instance.onEnd = () => {
      expect(rx).toBe(ri * itemWidth);
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };

    instance.start(5);
    instance.update(-50);
    instance.update(-100);
    instance.end();

    instance.start(5);
    instance.update(50);
    instance.update(100);
    instance.end();
  });

  it("限界値テスト", () => {
    const instance = new Slider();
    const logList = new SliderLogger();

    instance.onChange = (x, i) => {
      logList.add(x, i);
      expect(x).toBeGreaterThanOrEqual(0);
      //expect(x).toBeLessThanOrEqual(elementNum * itemWidth);
    };
    instance.init(initialWidth, elementNum, {
      isLoop: true,
      smooth: 0.1,
    });
    const updateLocation = (): void => {
      instance.start(5);
      instance.update(-100);
      instance.update(-400);
      instance.end();
      instance.start(5);
      instance.update(100);
      instance.update(400);
      instance.end();
    };
    updateLocation();
    instance.init(initialWidth, elementNum, {
      isLoop: false,
      smooth: 0.1,
    });
    updateLocation();
  });

  it("非ループ値限界値テスト", () => {
    const instance = new Slider();
    // let rx = 0;
    const logList: Array<{ x: number; i: number }> = [];

    instance.onChange = (x, i) => {
      logList.push({ x, i });
    //  rx = x;
    };
    instance.init(initialWidth, elementNum, {
      isLoop: false,
      smooth: 0.1,
    });

    // instance.onEnd = () => {
    //   expect(rx).toBe(0);
    // };
    instance.start(5);
    instance.update(25);
    instance.update(50);
    instance.update(75);
    instance.end();

    // instance.onEnd = () => {
    //   expect(rx).toBe(maxWidth - itemWidth);
    // };
    instance.start(0);
    instance.update(-25);
    instance.update(-50);
    instance.update(-75);
    instance.end();
  });

  it("インデックス移動テスト", () => {
    const instance = new Slider();
    instance.init(initialWidth, elementNum);

    const testIndex = (index: number): void => {
      // let ri = 0;
      // instance.onChange = (_, i) => {
      //   ri = i;
      // };
      // instance.onEnd = () => {
      //   expect(ri).toBe(index);
      // };
      instance.setIndex(index);
    };

    const testIndexList = [0, 1, 2, 3, 4, 5];

    testIndexList.sort(() => Math.random() - 0.5);
    testIndexList.forEach((i) => {
      testIndex(i);
    });

    testIndexList.sort(() => Math.random() - 0.5);
    testIndexList.forEach((i) => {
      testIndex(i);
    });
  });
});
