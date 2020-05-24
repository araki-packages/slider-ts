import * as THREE from 'three';

/**
 * bezierの結合
 * @param curveList
 */
export const createCurvePoint = <T extends THREE.Vector>(
  curveList: THREE.Curve<T>[]
): (point: number) => T => {
  const maxLength = curveList.reduce((n, bezier) => n + bezier.getLength(), 0);
  const bezierLengthPoint = curveList.map((bezier) => bezier.getLength() / maxLength);

  return (point: number): T => {
    const [calcPoint, calcIndex] = ((): [number, number] => {
      // 0-1
      let currentPoint = (() => {
        // マイナス値の除外
        if (point < 0) {
          return 1 + (point % 1);
        }
       return point % 1;
      })();

      for(let i = 0; i < bezierLengthPoint.length; i++) {
        const bezierLength = bezierLengthPoint[i];
        if (currentPoint - bezierLength <= 0) {
          return [currentPoint / bezierLength, i];
        }
        currentPoint = currentPoint - bezierLength;
      }
      return [1, bezierLengthPoint.length - 1];
    })();
    return curveList[calcIndex].getPointAt(calcPoint);
  };
};

export const createComputedCurvePointList = <T extends THREE.Vector> (
  curveList: THREE.Curve<T>[],
  points: number,
) => {
  const point = createCurvePoint(curveList);
  const pointList: T[] = [];
  for ( let i = 0; i < points; i ++ ) {
    pointList.push(point(i));
  }
  return pointList;
};