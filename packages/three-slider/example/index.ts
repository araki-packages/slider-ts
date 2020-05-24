import * as THREE from 'three';
import ThreeSliderObject from '../lib/SliderComponent';
import { Vector3 } from 'three';

const canvas = document.createElement('canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.autoClear = false;

canvas.style.maxWidth = '100vw';
canvas.style.width = '100vw';
canvas.style.maxHeight = '100vh';
canvas.style.height = '100vh';

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 30;
camera.lookAt(new Vector3(0, 0, 0))

const scene = new THREE.Scene();
const handleResize = () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', handleResize);
handleResize();
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);


const meshList: THREE.Mesh[] = [];
for (let i = 0; i < 40; i++ ) {
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(),
    new THREE.MeshNormalMaterial()
  );
  meshList.push(mesh);
}
const point = 4;
const bezier = [
  new THREE.CubicBezierCurve3(
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(point, -point, 0),
    new THREE.Vector3(point, -point, 0),
    new THREE.Vector3(0, -5, 0),
  ),
  new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, -5, 0),
    new THREE.Vector3(-point, -point, 0),
    new THREE.Vector3(-point, -point, 0),
    new THREE.Vector3(-5, 0, 0),
  ),
]
const SliderObject = new ThreeSliderObject(meshList, bezier);

document.addEventListener('wheel', (e) => {
  console.log(e);
  console.log('WHEEEEEEEL');
})
scene.add(SliderObject);
console.log(scene);


const main = () => {
  let prevTime = 0;

  const tick = (time: number) => {
    let deltaTime = time - prevTime;
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
    SliderObject.update(deltaTime);
    prevTime = time;
  };

  window.requestAnimationFrame((time: number) => {
    prevTime = time;
    window.requestAnimationFrame(tick);
  });
};
main();