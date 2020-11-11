import React, { useRef } from "react";
import useSlider from "./useSlider";

const SliderComponent: React.FC<{
  children: React.ReactElement[];
}> = ({ children }) => {
  const refWrapper = useRef<HTMLDivElement>(null);
  const onClick = useSlider(children, refWrapper);

  return (
    <div ref={refWrapper} onClick={onClick}>
      {children}
    </div>
  );
};

export default SliderComponent;
