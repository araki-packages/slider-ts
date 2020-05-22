export interface ISliderOptions {
  isLoop?: boolean; // 無限スクロールするかどうか
  isFit?: boolean; // 位置を同期させるかどうか
  wrapperWidth?: number;
  initialIndex?: number; // indexの初期位置
  smooth?: number; // 0 - 1 default 1
}
