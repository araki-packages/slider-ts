import { Slider } from "../SliderCore";

const oneFrameAtMS = 1000 / 120;
const useSpyRequestAnimationFrame = (): void => {
  beforeEach(() => {
    let i = 0;
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        i += oneFrameAtMS;
        callback(i);
        const id = Math.random();
        return id;
      });
  });
};

const useSpyPerformanceNow = (): void => {
  beforeEach(() => {
    let i = 1000;
    jest.spyOn(window.performance, "now").mockImplementation(() => {
      i += oneFrameAtMS;
      return i;
    });
  });
};

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

    return `\n${table}\n${record}\n`;
  }
}

const itemWidth = 100;
const elementNum = 5;
const initialWidth = itemWidth * elementNum;
useSpyRequestAnimationFrame();
useSpyPerformanceNow();

describe("基本動作テスト", () => {
  it("ループのテスト 整数", () => {
    const instance = new Slider(initialWidth, elementNum, {
      isLoop: true,
    });
    const logList = new SliderLogger();

    instance.onChange = (x, i) => {
      logList.add(x, i);
    };

    instance.onEnd = () => {
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };
    instance.start(5);
    instance.update(-100);
    instance.update(-200);
    instance.update(-300);
    instance.end();
  });

  it("ループのテスト 負数", () => {
    const instance = new Slider(initialWidth, elementNum, {
      isLoop: true,
    });
    const logList = new SliderLogger();

    instance.onChange = (x, i) => {
      logList.add(x, i);
    };

    instance.onEnd = () => {
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };
    instance.start(5);
    instance.update(100);
    instance.update(200);
    instance.update(300);
    instance.end();
  });

  it("非ループのテスト 整数", () => {
    const instance = new Slider(initialWidth, elementNum, {
      isLoop: false,
    });
    const logList = new SliderLogger();
    instance.onChange = (x, i) => {
      logList.add(x, i);
    };
    instance.onEnd = () => {
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };

    instance.start(5);
    instance.update(-10);
    instance.update(-15);
    instance.end();
  });

  it("非ループのテスト 負数", () => {
    const instance = new Slider(initialWidth, elementNum, {
      isLoop: false,
    });
    const logList = new SliderLogger();
    instance.onChange = (x, i) => {
      logList.add(x, i);
    };
    instance.onEnd = () => {
      expect(logList.toCSV()).toMatchSnapshot();
      logList.clear();
    };

    instance.start(5);
    instance.update(10);
    instance.update(15);
    instance.end();
  });

  it("インデックス移動テスト", () => {
    const instance = new Slider(initialWidth, elementNum);

    const testIndex = (index: number): void => {
      let rp = 0;
      let ri = 0;
      instance.onChange = (p, i) => {
        rp = p;
        ri = i;
      };
      instance.onEnd = () => {
        expect({
          rp,
          ri,
        }).toBe({
          rp: index * (initialWidth / elementNum),
          ri: index,
        });
      };
      instance.moveToByIndex(index);
    };

    const testIndexList = [0, 1, 2, 0, 3];

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
