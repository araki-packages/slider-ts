import * as react from 'react';
import { Slider, SliderOptions } from '@araki-packages/slider-core';

    // isLoop?: boolean;
    // isFit?: boolean;
    // initialIndex?: number;
    // offsetLeft?: number;
export type SliderComponentProps = {
  onChangeIndex?: (index: number) => void;
  children?: any;
  components: any[];
  copyNum: number;
} & SliderOptions;
export const SliderComponent: react.SFC<SliderComponentProps> = ({
  children,
  onChangeIndex,
  components,
  copyNum,
  isFit,
  isLoop,
  offsetLeft,
}) => {
  const wrapRef = react.useRef<HTMLDivElement>(null)
  const sliderInstance = react.useMemo<Slider>(() =>  new Slider(), []);
  const [currentIndex, setCurrentIndex] = react.useState(0);

  // events
  react.useEffect(() => {
    if (wrapRef.current == null) return;
    wrapRef.current.scrollWidth;

    sliderInstance.onChange = (x, index) => {
      if (wrapRef.current == null) return;
      wrapRef.current.style.transform = `translateX(${x}px)`;
      wrapRef.current.style.webkitTransform = `translateX(${x}px)`;
      setCurrentIndex(index);
    };
  }, []);

  // event listeners
  const handleStart = react.useCallback((x: number) => {
    // update event
    const mouseMoveHandler = (e: MouseEvent) => {
      sliderInstance.update(e.pageX);
    };
    const touchMoveHandler  = (e: TouchEvent) => {
      sliderInstance.update(e.touches[0].pageX);
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('touchmove', touchMoveHandler);

    // end event
    const mouseUpHandler = () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };

    const touchEndHandler = () => {
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('touchend', touchEndHandler);
  }, []);

  const handleOnMouse: react.MouseEventHandler<HTMLElement> = react.useCallback((e) => {
    handleStart(e.pageX);
  }, []);
  const handleTouchStart: react.TouchEventHandler<HTMLElement> = react.useCallback((e) => {
    handleStart(e.touches[0].pageX);
  }, []);

  // initialization
  react.useEffect(() => {
    if (wrapRef.current == null) return;
    sliderInstance.init(wrapRef.current.scrollWidth, components.length, copyNum, {
      isFit,
      isLoop,
      offsetLeft,
    });
  }, [isFit, isLoop, offsetLeft, components]);

  react.useEffect(() => {
    onChangeIndex && onChangeIndex(currentIndex);
  }, [currentIndex]);

  return (
    <div
      ref={wrapRef}
      onMouseDown={handleOnMouse}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};
