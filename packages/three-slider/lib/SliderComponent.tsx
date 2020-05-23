import * as THREE from 'three';

interface IOptions {
  isComputedWay?: boolean;
}

const initialOptions: Required<IOptions> = {
  isComputedWay: true,
};

class ThreeSliderObject extends THREE.Object3D {
  private sliderObjects: (THREE.Object3D|THREE.Mesh)[];
  private bezierList: THREE.CubicBezierCurve3[];
  private elapsedPosition: number = 0;

  constructor(
    objectList: (THREE.Object3D|THREE.Mesh)[],
    bezierList: THREE.CubicBezierCurve3[]
  ) {
    super();
    objectList.forEach((obj) => {
      this.add(obj);
    });
    this.sliderObjects = objectList;
    this.bezierList = bezierList;
  }

  public reset() {
    this.elapsedPosition = 0;
  }

  public update(deltaTime: number) {
    this.elapsedPosition += deltaTime;
  }
  public end() {
    this.elapsedPosition = 1;
  }

  /**
   * @param point [0-1]
   */
}

export default ThreeSliderObject;
