import React from 'react';
import { Slider, SliderOptions } from '@araki-packages/slider-core';

export type SliderComponentProps = {
  onChangeIndex?: (index: number) => void;
  components: React.ReactElement[];
  copyNum: number;
} & SliderOptions;

export const SliderComponent: React.SFC<SliderComponentProps> = ({
  onChangeIndex,
  components,
  copyNum,
  isFit,
  isLoop,
  offsetLeft,
}) => {
  const refWrap = React.useRef<HTMLDivElement>(null)
  const refIndex = React.useRef(0)
  const sliderInstance = React.useMemo<Slider>(() =>  new Slider(), []);

  // event listeners
  const handleStart = React.useCallback((x: number) => {
    sliderInstance.start(x);
    // update event
    const mouseMoveHandler = (e: MouseEvent) => sliderInstance.update(e.pageX);
    const touchMoveHandler = (e: TouchEvent) => sliderInstance.update(e.touches[0].pageX);

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('touchmove', touchMoveHandler);

    // end event
    const mouseUpHandler = () => {
      sliderInstance.end();
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };

    const touchEndHandler = () => {
      sliderInstance.end();
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('touchend', touchEndHandler);
  }, []);

  const handleOnMouse: React.MouseEventHandler<HTMLElement> = React.useCallback((e) => handleStart(e.pageX), []);
  const handleTouchStart: React.TouchEventHandler<HTMLElement> = React.useCallback((e) => handleStart(e.touches[0].pageX), []);

  // initialization
  React.useLayoutEffect(() => {
    if (refWrap.current == null) return;
    sliderInstance.onChange = (x, index) => {
      if (refWrap.current == null) return;
      refWrap.current.style.transform = `translateX(${x}px)`;
      refWrap.current.style.webkitTransform = `translateX(${x}px)`;

      if (refIndex.current === index) return;
      refIndex.current = index;
      onChangeIndex && onChangeIndex(index);
    };

    sliderInstance.init(refWrap.current.scrollWidth, components.length, copyNum, {
      isFit,
      isLoop,
      offsetLeft,
    });
  }, [isFit, isLoop, offsetLeft, components]);

  return (
    <div style={{
        maxWidth: '100%',
        width: '100%',
        overflowX: 'hidden',
        msOverflowX: 'hidden',
    }}>
      <div
        ref={refWrap}
        onMouseDown={handleOnMouse}
        onTouchStart={handleTouchStart}
        style={{
          display: 'inline-flex',
        }}
      >
          {
            Array(copyNum)
              .fill(1)
              .map((_, index) => components[components.length - (copyNum - index)])
          }
          { components }
          {
            Array(copyNum)
              .fill(1)
              .map((_, index) =>  components[index])
          }
      </div>
    </div>
  );
};