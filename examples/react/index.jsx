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

const Test = () => {
  const refWrap = React.useRef(null);
  return (
    <div style={{
        maxWidth: '100%',
        width: '100%',
        overflowX: 'hidden',
        msOverflowX: 'hidden',
    }}>
      <div
        ref={refWrap}
        style={{
          display: 'inline-flex',
        }}>
      </div>
    </div>
  )

}

const ImageSlider = () => {
  console.log(new Slider());
  const Components = React.useMemo(() => {
    return [
      <ImageComponent seed={1000}/>,
      <ImageComponent seed={1000}/>,
      <ImageComponent seed={1000}/>,
      <ImageComponent seed={1000}/>,
      <ImageComponent seed={2000}/>,
      <ImageComponent seed={3000}/>,
      <ImageComponent seed={4000}/>,
    ];
  });
  return (
    <>
      <Test />
      <SliderComponent
        components={Components}
        copyNum={3}
      />
    </>
  );
}
ReactDOM.render(<ImageSlider />, document.body);
