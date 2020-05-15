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

const ImageComponent = ({seed, name}) => {
  console.log(seed);
  return <div
    style={{
      width: 200,
      height: 200,
      userSelect: 'none',
      backgroundImage: `url(${createMockImageUrl(seed)})`,
    }}
    onDragStart={(e) => {
      e.stopPropagation();
    }}

    data-name={name}
  />
}
const ImageSlider = () => {
  console.log(new Slider());
  const Components = React.useMemo(() => {
    return [
      <ImageComponent name={'0'} seed={0xFFFFFF}/>,
      <ImageComponent name={'1'} seed={0xAAAAAA}/>,
      <ImageComponent name={'2'} seed={0xDDDDDD}/>,
      <ImageComponent name={'3'} seed={0x000000}/>,
      <ImageComponent name={'4'} seed={0x444444}/>,
      <ImageComponent name={'5'} seed={0xAAAAAA}/>,
      <ImageComponent name={'6'} seed={0xbbbbbb}/>,
    ];
  });
  return (
    <>
      <SliderComponent
        components={Components}
        offsetLeft={100}
        isLoop
        copyNum={2}
      />
    </>
  );
}
ReactDOM.render(<ImageSlider />, document.body);
