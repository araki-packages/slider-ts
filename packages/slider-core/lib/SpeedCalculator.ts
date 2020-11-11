import { MoveRelation } from "./interfaces";

const G = 100.8;

/**
 * SpeedCalculator
 * @summary
 */
export class SpeedCalculator {
  private movementState: MoveRelation[] = [];
  constructor(public cacheNum: number) {}
  public reset() {
    this.movementState = [];
  }

  public add(relation: MoveRelation) {
    this.movementState.push({
      ...relation,
      time: relation.time,
    });
    if (this.movementState.length > this.cacheNum) {
      this.movementState.shift();
    }
  }

  public getAverage(): MoveRelation {
    const initialState = {
      distance: 0,
      time: 0,
      verocity: 0,
    };
    const result = this.movementState.reduce((prev, next): MoveRelation => {
      return {
        distance: prev.distance + next.distance,
        time: prev.time + next.time,
        verocity: prev.verocity + next.verocity,
      };
    }, initialState);

    if (this.movementState.length === 0) return initialState;

    return {
      distance: result.distance / this.movementState.length,
      time: result.time / this.movementState.length,
      verocity: result.verocity / this.movementState.length,
    };
  }
  public getNextPosition(): MoveRelation {
    if (this.movementState.length === 0) {
      return { verocity: 0, distance: 0, time: 0 };
    }

    const verocity =
      this.movementState.reduce((p, n) => p + n.verocity, 0) /
      this.movementState.length;
    const time = Math.abs(verocity * verocity * G);
    return {
      verocity: verocity,
      distance: verocity * time,
      time: time * 10,
    };
  }
}
