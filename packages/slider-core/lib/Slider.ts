import { SpeedCalculator } from './SpeedCalculator';
import { SliderOptions } from '../interfaces/lib/common';
import { InitialSliderOptions } from '../constants/lib/common';

export class Slider {
  private width!: number; // 全体の長さ
  private isLoop!: boolean; // ループするかどうか
  private isFit!: boolean;
  private currentX = 0; // 現在の位置情報
  private elementNum = 0; // 総エレメント巣
  private speedCalc: SpeedCalculator;
  private smooth: number = 0;

  private itemWidth!: number;
  private deltaTime = 0; // 時間の差分
  private deltaMove = 0; // updateの移動値の差分

  private animationID?: number;
  public onChange?: (x: number, index: number) => void; // changeEvent
  public onEnd?: () => void; // endEvent

  /**
   * カルーセルクラス
   * @param width
   * @param isLoop 無限ループさせるかどうか
   */
  constructor(caches: number = 10) {
    this.speedCalc = new SpeedCalculator(caches);
  }

  // 初期化イベント
  /**
   * @param width 描画範囲
   * @param viewElementNum 描画範囲内のアイテム数
   * @param options.isLoop
   * @param options.isFit
   * @param options.initialIndex
   * @param options.smooth - 移動時のなめらかさ
   */
  public init(
    width: number,
    viewElementNum: number,
    options?: SliderOptions,
  ) {
    const setOption = {...InitialSliderOptions, ...options};
    this.width = width;
    this.smooth = Math.max(setOption.smooth, 0.01);
    this.elementNum = viewElementNum;
    this.itemWidth = this.width / this.elementNum;
    this.isLoop = setOption.isLoop;
    this.isFit = setOption.isFit;
    this.currentX = setOption.initialIndex * this.itemWidth;
    this.handleChange();
  }

  // タッチ or クリック 開始時に呼ばれるメソッド
  public start(x: number) {
    cancelAnimationFrame(this.animationID || 0);
    this.deltaMove = x;
    this.speedCalc.reset();
  }

  // 場所のアップデート
  public update(x: number) {
    const moveOffset = this.deltaMove - x;
    this.deltaTime = this.deltaTime - performance.now();
    this.currentX += moveOffset;
    this.updateLocation();
    this.handleChange();
    this.speedCalc.add(moveOffset / this.deltaTime * 50);
    this.deltaTime = performance.now();
    this.deltaMove = x;
  }

  public handleChange() {
    const index = Math.round(this.currentX / this.itemWidth);
    this.onChange && this.onChange(this.currentX, index);
  }
  // ロケーションのアップデート
  public updateLocation() {
    const maxLength = this.itemWidth * this.elementNum;
    if (this.isLoop) {
      if (this.currentX < 0) {
        this.currentX = maxLength + (this.currentX % maxLength);
        return;
      }
      this.currentX %= maxLength;
      return;
    } else {
      if (this.currentX < 0) {
          this.currentX = 0;
          return;
      }
      if (this.currentX > maxLength - this.itemWidth) {
          this.currentX = maxLength - this.itemWidth;
          return;
      }
    }
  }

  // タッチイベント終了時
  public end() {
    const speed = this.speedCalc.get() * 10 * this.smooth;
    const maxTime = Math.min(Math.max(Math.abs(speed), 100), 1000); // 速度の算出（最低２００ｍｓ）
    this.moveTo(speed, maxTime * this.smooth);
  }

  // 次のスライド
  public next(duration: number = 100) {
    this.currentX % this.itemWidth - this.itemWidth
    this.moveTo(this.itemWidth, duration);
  }

  // 前のスライド
  public prev(duration: number = 100) {
    this.moveTo(-this.itemWidth, duration);
  }

  // TODO
  public setIndex(index: number, duration: number = 1000) {
    const target = (index) * this.itemWidth
    this.moveTo(target - this.currentX, duration);
  }

  // 慣性スクロール
  public moveTo(movementPosition: number, maxTime: number) {
    // 最終到達地点が半分かそうじゃないかで分岐
    const calcMovementPosition = this.isFit ? Math.floor(movementPosition
      // koko
      - (this.itemWidth - this.currentX % this.itemWidth)
      // koko
      + (this.itemWidth - movementPosition % this.itemWidth))
      : movementPosition;

    let deltaTime = 0;
    let elapsedTime = 0;

    const position = this.currentX;
    const tick = (time: number) => {
      if (elapsedTime > maxTime) {
        this.currentX = position - calcMovementPosition;
        this.updateLocation();
        this.handleChange();
        this.onEnd && this.onEnd();
        return;
      }
      deltaTime = time - deltaTime;
      elapsedTime += deltaTime;
      const offsetPosition = Math.sin((elapsedTime / maxTime) * (Math.PI / 2))
      const movement = offsetPosition * calcMovementPosition;
      this.currentX = position - movement;
      this.updateLocation();
      this.handleChange();
      deltaTime = time;
      this.animationID = window.requestAnimationFrame(tick);
    }

    requestAnimationFrame((time: number) => {
      deltaTime = time;
      requestAnimationFrame(tick);
    })
  }
}
