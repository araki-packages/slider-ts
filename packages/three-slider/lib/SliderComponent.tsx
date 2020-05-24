import Slider from '@araki-packages/slider-core';
import * as THREE from 'three';
import { createCurvePoint } from '../utils/BezierUtil';

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
  private slider: Slider;
  private getPoint: (point: number) => THREE.Vector3;

  constructor(
    objectList: (THREE.Object3D|THREE.Mesh)[],
    bezierList: THREE.CubicBezierCurve3[]
  ) {
    super();
    this.slider = new Slider(4);
    objectList.forEach((obj) => {
      this.add(obj);
    });
    this.sliderObjects = objectList;
    this.bezierList = bezierList;
    this.getPoint = createCurvePoint(this.bezierList);

    // this.slider.onChange = (num) => {
    //   this.sliderObjects
    //     .forEach((object, index) => {
    //       const initialPoint = this.getPoint((index / this.sliderObjects.length + (num / (window.innerWidth * 3))) % 1);
    //       object.position.x = initialPoint.x;
    //       object.position.y = initialPoint.y;
    //       object.position.z = initialPoint.z;
    //     });
    // };

    let delta = 0;
    window.addEventListener('wheel', (e: WheelEvent) => {
      delta += e.deltaY / 5000;
      this.sliderObjects
        .forEach((object, index) => {
          const initialPoint = this.getPoint((index / this.sliderObjects.length + (delta)));
          object.position.x = initialPoint.x;
          object.position.y = initialPoint.y;
          object.position.z = initialPoint.z;
        });
    });

    this.initialize();
  }

  private initialize() {
    this.slider.init((window.innerWidth * 3), this.sliderObjects.length, {
      isLoop: true,
      isFit: true,
      smooth: 0.5,
    });

    document.addEventListener('mousedown', (e) => {
      this.slider.start(e.pageX);
      const mouseMoveHandler = (e:MouseEvent) => {
        this.slider.update(e.pageX);
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', () => {
        this.slider.end();
        document.removeEventListener('mousemove', mouseMoveHandler);
      })
    });
  }

  public reset() {
    this.elapsedPosition = 0;
  }

  public update(deltaTime: number) {
    // this.elapsedPosition += deltaTime / 10000;
  }
  public end() {
    this.elapsedPosition = 1;
  }

  /**
   * @param point [0-1]
   */
}

export default ThreeSliderObject;
