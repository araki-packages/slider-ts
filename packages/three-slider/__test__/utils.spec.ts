import * as THREE from 'three';
import { createCurvePoint } from '../utils/BezierUtil';

const testCase = [
  new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
  ),
  new THREE.CubicBezierCurve3(
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(2, 2, 2),
  ),
  new THREE.CubicBezierCurve3(
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(2.5, 2.5, 2.5),
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(2.5, 2.5, 2.5),
  ),
]
const vec3Test = (a: THREE.Vector3, b: THREE.Vector3) => {
  expect(a.x).toBeCloseTo(b.x);
  expect(a.y).toBeCloseTo(b.y);
  expect(a.z).toBeCloseTo(b.z);
}

const vec3ToCSVParser = (vec3: THREE.Vector3, index: number, object: THREE.Vector3[]) => {
  return `${index / (object.length - 1)}, ${vec3.x}, ${vec3.y}, ${vec3.z}`;
}
describe('getCurvePoint test', () => {

  const getPoint = createCurvePoint<THREE.Vector3>(testCase);

  it('限界値テスト', () => {
    vec3Test(getPoint(0), new THREE.Vector3(0, 0, 0));
    vec3Test(getPoint(1), new THREE.Vector3(2.5, 2.5, 2.5));
  });

  it('snapshot', () => {
    const max = 20;
    const vecList = Array(max)
      .fill(1)
      .map((_, index) => getPoint(index / (max - 1)))
      .map(vec3ToCSVParser)
      .join('\n');

    expect(vecList).toMatchSnapshot();
  });
});
