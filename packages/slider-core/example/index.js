const offset = 0;
const startSliderByElementID = (wrap, options, autoNext) => {
  const sliderInstance = new SliderCore.Slider(wrap.children[0].scrollWidth * 7, 7, options);

  sliderInstance.onChange = (x) => {
    wrap.style.transform = `translateX(${-x}px)`;
  };
  if (autoNext) {
    offset += 320;
    setTimeout(() => {
      setInterval(() => {
        sliderInstance.next(1000);
      }, 1000);
    }, offset);
  }

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

  const createButton = (text, cb) => {
    const elButton = document.createElement("button");
    elButton.innerText = text;
    elButton.addEventListener("click", cb);
    return elButton;
  };
  const button = createButton("next", () => {
    console.log("clicked");
    sliderInstance.next(2000);
    console.log("next");
  });
  document.body.appendChild(button);
};

window.onload = () => {
  startSliderByElementID(document.getElementById("slider"));
  startSliderByElementID(document.getElementById("slider2"), {
    isLoop: false,
  });
  startSliderByElementID(document.getElementById("slider3"), {
    isFit: true,
  });
  const elements = document.querySelectorAll('.auto-slider');
  for (let i = 0; i < elements.length; i++ ) {
    console.log(elements[i]);
    startSliderByElementID(elements[i], undefined, true);
  }
}
