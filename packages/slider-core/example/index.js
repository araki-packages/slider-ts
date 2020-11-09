const startSliderByElementID = (elementId) => {
  const wrap = document.getElementById(elementId)
  // const childNodes = wrap.childNodes
  const sliderInstance = new SliderCore.Slider(962 * 7, 7);

  sliderInstance.onChange = (x) => {
    wrap.style.transform = `translateX(${-x}px)`;
  };

  const update = (e) => {
    sliderInstance.update(-e.pageX);
  }
  const end = () => {
    window.removeEventListener('mousemove', update)
    window.removeEventListener('mouseup', end)
    sliderInstance.end();
  }

  wrap.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sliderInstance.start(-e.pageX);
    window.addEventListener('mousemove', update);
    window.addEventListener('mouseup', end);
  });
  const createButton = (text, cb) => {
    const elButton = document.createElement('button');
    elButton.innerText = text;
    elButton.addEventListener('click', cb);
    return elButton;
  }
  const button = createButton('next', () => {
    console.log('clicked');
    sliderInstance.next(2000);
    console.log('next');
  });
  document.body.appendChild(button)

}
startSliderByElementID('slider');

