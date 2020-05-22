import { Slider } from "../..";

export const main = (): void => {
  const slider = new Slider(5);
  const elTest = document.getElementById("fit");

  if (elTest == null) return;
  const itemWidth = elTest.scrollWidth / 9;
  console.log(elTest.scrollWidth);
  slider.update = (x) => {
    elTest.style.transform = `translate(${x * -1 + itemWidth * -2}px)`;
  };

  console.log(itemWidth);
  slider.init(itemWidth * 5, 5, {
    isLoop: true,
    isFit: true,
  });

  let isMouseDown = false;
  elTest.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    slider.start(e.pageX);
    console.log(e.pageX);
  });

  document.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      slider.update(e.pageX);
    }
  });

  document.addEventListener("mouseup", () => {
    if (isMouseDown) {
      slider.end();
    }
    isMouseDown = false;
  });
};
