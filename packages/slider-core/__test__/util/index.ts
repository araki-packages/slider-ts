
let oneFrameAtMS = 1000 / 120;
export const useSpyRequestAnimationFrame = () => {
  beforeEach(() => {
    let i = 0;
    jest.spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        i += oneFrameAtMS;
        callback(i);
        return Math.random();
      });
  });
};

export const useSpyPerformanceNow = () => {
  beforeEach(() => {
    let i = 100;
    jest.spyOn(window.performance, 'now')
      .mockImplementation(() => {
        i += oneFrameAtMS;
        return i;
      });
  });
};

export const sleep = (time: number) => {
  return new Promise((r) => {
    setTimeout(() => {
      r();
    }, time);
  })
}