import { BEZIER, ISliderOptions } from "../interfaces/";
import bezier from "@takumus/cubic-bezier";
const EASE_OUT: BEZIER = [0, 0, 0.58, 1];
export const InitialSliderOptions: Required<ISliderOptions> = {
  isLoop: true,
  wrapperWidth: 0,
  isFit: false,
  initialIndex: 0,
  smooth: 1,
  bezier: bezier(...EASE_OUT),
};
