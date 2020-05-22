import { SpeedCalculator } from './SpeedCalculator';
import { SliderOptions } from '../interfaces/lib/common';
import { InitialSliderOptions } from '../constants/lib/common';

export class Slider {
  /* event listeners */
  public onChange?: (x: number, index: number) => void; // changeEvent
  public onEnd?: () => void; // endEvent

  /* fields */
  private width!: number; // 全体の長さ
  private currentX = 0; // 現在の位置情報
  private elementNum = 0; // 総エレメント巣
  private speedCalc: SpeedCalculator;
  private itemWidth!: number;

  private prevUpdateProps: {time: number, position: number} = {
    time: 0,
    position: 0,
  }

  private option!: Required<SliderOptions>;
  private rafToken?: number; // requestAnimationFrameのキャンセルトークン

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
    option?: SliderOptions,
  ) {
    this.option = {...InitialSliderOptions, ...option};
    this.option.smooth = Math.max(this.option.smooth, 0.01);

    this.width = width;
    this.elementNum = viewElementNum;
    this.itemWidth = this.width / this.elementNum;
    this.currentX = this.option.initialIndex * this.itemWidth;
    this.handleChange();
  }

  // タッチ or クリック 開始時に呼ばれるメソッド
  public start(position: number) {
    cancelAnimationFrame(this.rafToken || 0);
    this.prevUpdateProps = {
      position: position,
      time: performance.now(),
    }
    this.speedCalc.reset();
  }

  // 場所のアップデート
  public update(position: number) {
    const { position: pPosition, time: pTime } = this.prevUpdateProps;

    const moveOffset = pPosition - position;
    const deltaTime = pTime - performance.now();

    this.currentX += moveOffset;
    this.updateLocation();
    this.handleChange();
    this.speedCalc.add(moveOffset / deltaTime * 50);

    this.prevUpdateProps = {
      time: performance.now(),
      position,
    }
  }

  // タッチイベント終了時
  public end() {
    const speed = this.speedCalc.get() * 10 * this.option.smooth;
    const maxTime = Math.min(Math.max(Math.abs(speed), 100), 1000); // 速度の算出（最低２００ｍｓ）
    this.moveTo(speed, maxTime * this.option.smooth);
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
  private moveTo(movementPosition: number, maxTime: number) {
    // 最終到達地点が半分かそうじゃないかで分岐
    const calcMovementPosition = this.option.isFit ? Math.floor(movementPosition
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
      this.rafToken = window.requestAnimationFrame(tick);
    }

    requestAnimationFrame((time: number) => {
      deltaTime = time;
      requestAnimationFrame(tick);
    })
  }

  private handleChange() {
    const index = Math.round(this.currentX / this.itemWidth);
    this.onChange && this.onChange(this.currentX, index);
  }
  // ロケーションのアップデート
  private updateLocation() {
    if (this.option.isLoop) {
      this.updateLocationIsLoop();
    } else {
      this.updateLocationIsNotLoop();
    }
  }

  private updateLocationIsLoop() {
    const maxLength = this.itemWidth * this.elementNum;
    if (this.currentX < 0) {
      this.currentX = maxLength + (this.currentX % maxLength);
      return;
    }
    this.currentX %= maxLength;
  }

  private updateLocationIsNotLoop() {
    const maxLength = this.itemWidth * this.elementNum;
    const minPosition = 0;
    const maxPosition = maxLength - this.itemWidth - this.option.wrapperWidth
    if (this.currentX < minPosition) {
        this.currentX = 0;
        return;
    }
    if (this.currentX > maxPosition) {
        this.currentX = maxLength - this.itemWidth - this.option.wrapperWidth;
        return;
    }
  }

}
