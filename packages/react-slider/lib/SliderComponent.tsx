import React from "react";
import { Slider } from "@araki-packages/slider-core";
import { SliderOptions } from "../../slider-core/dist";

export type SliderComponentProps = {
  onChangeIndex?: (index: number) => void;
  components: Array<React.ReactElement>;
  copyNum: number;
  offsetLeft: number;
} & SliderOptions;

export const SliderComponent: React.SFC<SliderComponentProps> = ({
  onChangeIndex,
  components,
  copyNum,
  isFit,
  offsetLeft,
  isLoop,
}) => {
  const refWrap = React.useRef<HTMLDivElement>(null);
  const refIndex = React.useRef(0);
  const sliderInstance = React.useMemo<Slider>(() => new Slider(), []);

  // event listeners
  const handleStart = React.useCallback((x: number) => {
    sliderInstance.start(x);
    console.log("handle start");
    // update event
    const mouseMoveHandler = (e: MouseEvent): void => {
      sliderInstance.update(e.pageX);
    };
    const touchMoveHandler = (e: TouchEvent): void => {
      sliderInstance.update(e.touches[0].pageX);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("touchmove", touchMoveHandler);

    // end event
    const mouseUpHandler = (): void => {
      sliderInstance.end();
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    const touchEndHandler = (): void => {
      sliderInstance.end();
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };

    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("touchend", touchEndHandler);
  }, []);

  const handleOnMouse: React.MouseEventHandler<HTMLElement> = React.useCallback(
    (e) => handleStart(e.pageX),
    []
  );
  const handleTouchStart: React.TouchEventHandler<HTMLElement> = React.useCallback(
    (e) => handleStart(e.touches[0].pageX),
    []
  );

  // initialization
  React.useLayoutEffect(() => {
    if (refWrap.current == null) return;
    const elementWidth =
      refWrap.current.scrollWidth / (components.length + copyNum * 2);
    sliderInstance.onChange = (x, index) => {
      if (refWrap.current == null) return;
      const left = offsetLeft || 0;
      refWrap.current.style.transform = `translateX(${
        (x + left + elementWidth * copyNum) * -1
      }px)`;
      refWrap.current.style.webkitTransform = `translateX(${
        (x + left + elementWidth * copyNum) * -1
      }px)`;
      if (refIndex.current === index) return;
      refIndex.current = index;
      onChangeIndex && onChangeIndex(index);
    };

    sliderInstance.init(elementWidth * components.length, components.length, 4);
  }, [isFit, isLoop, components]);

  return (
    <div
      style={{
        maxWidth: "100%",
        width: "100%",
        overflowX: "hidden",
        msOverflowX: "hidden",
      }}
    >
      <div
        ref={refWrap}
        onMouseDown={handleOnMouse}
        onTouchStart={handleTouchStart}
        style={{
          display: "inline-flex",
        }}
      >
        {Array(copyNum)
          .fill(1)
          .map((_, index) => components[components.length - (copyNum - index)])}
        {components}
        {Array(copyNum)
          .fill(1)
          .map((_, index) => components[index])}
      </div>
    </div>
  );
};
