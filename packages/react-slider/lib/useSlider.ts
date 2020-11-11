import { Slider } from "@araki-packages/slider-core";
import { ReactElement, RefObject, useCallback, useEffect, useRef } from "react";

const useSlider = (
  childNodes: ReactElement[],
  refWrapper: RefObject<HTMLElement>
) => {
  const refSlider = useRef<Slider | null>(null);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) refSlider.current!.update(e.pageX);
    if (e instanceof TouchEvent) refSlider.current!.update(e.touches[0].pageX);
  }, []);

  const handleEnd = useCallback(() => {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchend", handleEnd);

    refSlider.current!.end();
  }, []);

  const handleStart: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      refSlider.current!.start(e.pageX);
      window.addEventListener("mousemove", handleMove, { passive: true });
      window.addEventListener("touchmove", handleMove, { passive: true });
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);
    },
    []
  );

  useEffect(() => {
    if (refWrapper.current == null) return;
    const widthEl = refWrapper.current.scrollWidth;
    refSlider.current = new Slider(widthEl, childNodes.length);
  }, [childNodes]);

  return handleStart;
};

export default useSlider;
