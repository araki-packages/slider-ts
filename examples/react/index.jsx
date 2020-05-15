import React from 'react';
import ReactDOM from 'react-dom';
import { SliderComponent } from '@araki-packages/react-slider';
import { Slider } from '@araki-packages/slider-core';

console.log(SliderComponent);
// init
/**
 *
 * @param {number} seed - seed値
 */
const createMockImageUrl = (seed) => {
  const back = seed.toString(16);
  const type = (seed ^ 0xFFFFFF).toString(16);
  return `https://dummyimage.com/600x400/${back}/${type}`;
};

const ImageComponent = (seed) => {
  return <img src={createMockImageUrl(seed)}/>
}
const ImageSlider = () => {
  console.log(new Slider());
  const Components = React.useMemo(() => {
    return [
      <ImageComponent seed={0xFFFFFF}/>,
      <ImageComponent seed={0xAAAAAA}/>,
      <ImageComponent seed={0xDDDDDD}/>,
      <ImageComponent seed={0x000000}/>,
      <ImageComponent seed={0x444444}/>,
      <ImageComponent seed={0xAAAAAA}/>,
      <ImageComponent seed={0xbbbbbb}/>,
    ];
  });
  return (
    <>
      <SliderComponent
        components={Components}
        copyNum={3}
      />
    </>
  );
}
ReactDOM.render(<ImageSlider />, document.body);
