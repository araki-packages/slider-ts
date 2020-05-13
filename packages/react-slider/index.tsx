import * as react from 'react';
import { Slider } from '@araki-packages/slider-core';

export interface SliderComponentProps {
  onChangeIndex?: (index: number) => void;
  children?: any;
}
export const SliderComponent: react.SFC<SliderComponentProps> = ({
  children,
  onChangeIndex,
}) => {
  const wrapRef = react.useRef<HTMLDivElement>(null)
  const sliderInstance = react.useMemo<Slider>(() =>  new Slider(), []);
  const [currentIndex, setCurrentIndex] = react.useState(0);

  react.useEffect(() => {
    if (wrapRef.current == null) return;

    sliderInstance.onChange = (x, index) => {
      if (wrapRef.current == null) return;
      wrapRef.current.style.transform = `translateX(${x}px)`;
      wrapRef.current.style.webkitTransform = `translateX(${x}px)`;
      setCurrentIndex(index);
    };
  }, []);

  react.useEffect(() => {
    onChangeIndex && onChangeIndex(currentIndex);
  }, [currentIndex]);

  return (
    <div ref={wrapRef}>
      {children}
    </div>
  );
};
