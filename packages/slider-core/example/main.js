const slider = new sliderCore.Slider();
slider.init(1000, 5, {
  isLoop: true,
  isFit: true,
});
const list = [];

let startTime = 0;
slider.onChange = (x, i) => {
  list.push({y:x, x: performance.now() - startTime });
};
slider.onEnd = () => {
  console.log(list[list.length - 1]);
  const ctx = canvas.getContext('2d');
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


const move = (offset, duration) => {
  return new Promise((r) => {
    setTimeout(() => {
      slider.update(offset);
      r();
    }, duration)
  })
};

const main = async () => {
  slider.start(0);
  startTime = performance.now();
  await move(0, 16);
  await move(-100, 16);
  await move(-200, 16);
  await move(-300, 16);
  await move(-315, 16);
  slider.end();
};
main();

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);