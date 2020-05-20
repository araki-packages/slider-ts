import { Slider } from '../../index';

export const main = () => {
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
};