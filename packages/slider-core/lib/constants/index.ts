import { BEZIER, ISliderOptions } from "../interfaces/";
import bezier from "@takumus/cubic-bezier";

// const EASE_OUT: BEZIER = [0.25, 0.1, 0.25, 1];
const SLOW: BEZIER = [0,.99,.04,.98];
export const InitialSliderOptions: Required<ISliderOptions> = {
  isLoop: true,
  wrapperWidth: 0,
  isFit: false,
  initialIndex: 0,
  smooth: 1,
  bezier: bezier(...SLOW),
};
