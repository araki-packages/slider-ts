import { Slider } from '../index';
import Chart from 'chart.js';

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
  slider.onChange = (x, i) => {
    list.push({y:x, x: performance.now() - startTime });
    elTest.style.transform = `translate(${x * -1}px)`;
  };
  slider.onEnd = () => {
    console.log(list[list.length - 1]);
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              label: 'Scatter Dataset',
              data: list,
          }]
      },
      options: {
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      }
    });
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

const main = () => {
  const slider = new Slider(5);
  const elTest = document.getElementById('fit');

  if (elTest == null) return;
  const itemWidth = elTest.scrollWidth / 9;
  console.log(elTest.scrollWidth)
  slider.onChange = (x) => {
    elTest.style.transform = `translate(${(x * -1) + (itemWidth * -2)}px)`;
  };
  console.log(itemWidth);
  slider.init(itemWidth * 5, 5, {
    isLoop: true,
    isFit: true,
  });
  let isMouseDown = false;
  elTest.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    slider.start(e.pageX);
    console.log(e.pageX)
  });
  document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
      slider.update(e.pageX);
    }
  });
  document.addEventListener('mouseup', (e) => {
    if (isMouseDown) {
      slider.end();
    }
    isMouseDown = false;
  });
}
main();
test();