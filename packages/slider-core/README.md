# `@araki-packages/slider-core`

core package

## Usage

```js
const sliderCore = require('@araki-packages/slider-core');

const offset = 0;
const startSliderByElementID = (wrap, options, autoNext) => {
  const sliderInstance = new sliderCore.Slider(wrap.children[0].scrollWidth * 7, 7, options);

  sliderInstance.onChange = (x) => {
    wrap.style.transform = `translateX(${-x}px)`;
  };

  // update to
  const update = (e) => {
    sliderInstance.update(-e.pageX);
  };

  const end = () => {
    window.removeEventListener("mousemove", update);
    window.removeEventListener("mouseup", end);
    sliderInstance.end();
  };
  wrap.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    sliderInstance.start(-e.pageX);
    window.addEventListener("mousemove", update);
    window.addEventListener("mouseup", end);
  });
};

window.onload = () => {
  startSliderByElementID(document.getElementById("slider1"), {
    isLoop: false,
    isFit: true,
  });
};
```

