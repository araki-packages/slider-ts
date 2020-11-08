export type BEZIER = [number, number, number, number];
export interface ISliderOptions {
  isLoop?: boolean; // 無限スクロールするかどうか
  isFit?: boolean; // 位置を同期させるかどうか
  wrapperWidth?: number;
  initialIndex?: number; // indexの初期位置
  smooth?: number; // 0 - 1 default 1
  bezier?: (elapse: number) => number;
}
export interface MoveRelation {
  verocity: number;
  distance: number;
  time: number;
}
