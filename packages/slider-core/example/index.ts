import { Slider } from '../index';
import { CreateTestElement } from './utils/TestElement';
// import * as DAT from 'dat.gui';

const test = () => {
  const slider = new Slider(5);
  const list: {x: number, y: number}[] = [];

  let startTime = 0;
  const elTest = document.getElementById('hoge');
  if (elTest == null) return;
  slider.init(elTest.scrollWidth, 5, {
    isLoop: true,
    isFit: false,
  });

  slider.update = (x) => {
    list.push({y:x, x: performance.now() - startTime });
    elTest.style.transform = `translate(${x * -1}px)`;
  };
  slider.onEnd = () => {
  };


  const move = (offset: number, duration: number) => {
    return new Promise((r) => {
      setTimeout(() => {
        slider.update(offset);
        r();
      }, duration)
    })
  };

  const offset = Math.random() * 100;
  const main = async () => {
    slider.start(0);
    startTime = performance.now();
    for (let i = 0; i < 10; i++) {
      await move(i * -1 * offset, 16);
    }
    slider.end();
  };
  main();
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
};

document.body.appendChild(CreateTestElement());
test();