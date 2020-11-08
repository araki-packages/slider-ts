import {MoveRelation} from "./interfaces";

/**
 * SpeedCalculator
 * @summary
 */
export class SpeedCalculator {
  private movementState: MoveRelation[] = [];
  private startTime: number = 0;
  constructor(public cacheNum: number) {}
  public  reset(startTime: number) {
    this.startTime = startTime;
    this.movementState = [];
  }
  public add(relation: MoveRelation) {
    this.movementState.push({
      ...relation,
      time: -this.startTime - relation.time,
    })
    if (this.movementState.length > this.cacheNum) {
      this.movementState.shift();
    }
  }
  public getAverageVerocity() {
    if (this.movementState.length === 0) return 0;
    const result = this.movementState.reduce((prev, next) => {
      return next.verocity + prev;
    }, 0) / this.movementState.length;
    return result;
  }
}
