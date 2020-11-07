const oneFrameAtMS = 1000 / 1200;

export const useSpyRequestAnimationFrame = (): void => {
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

export const useSpyCancelAnimationFrame = (): void => {
  beforeEach(() => {
    let i = 0;
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        i += oneFrameAtMS;
        callback(i);
        return Math.random();
      });
  });
};

export const useSpyPerformanceNow = (): void => {
  beforeEach(() => {
    let i = 1000;
    jest.spyOn(window.performance, "now").mockImplementation(() => {
      i += oneFrameAtMS;
      return i;
    });
  });
};

export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
