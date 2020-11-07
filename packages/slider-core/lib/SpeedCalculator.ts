export class SpeedCalculator {
  speedList: number[] = [];
  constructor(public cacheNum: number) {}
  public  reset() {
    this.speedList = [];
  }
  public add(speedNum: number) {
    this.speedList.push(speedNum)
    if (this.speedList.length > this.cacheNum) {
      this.speedList.shift();
    }
  }
  public get() {
    if (this.speedList.length === 0) return 0;
    const result = this.speedList.reduce((prev, next) => {
      return prev + next;
    }) / this.speedList.length;
    return result;
  }
}
