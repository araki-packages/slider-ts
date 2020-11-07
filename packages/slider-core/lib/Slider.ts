import { SpeedCalculator } from "./SpeedCalculator";
import { ISliderOptions } from "../interfaces/lib/common";
import { InitialSliderOptions } from "../constants/lib/common";

export class Slider {
  /* event listeners */
  public onChange?: (x: number, index: number) => void; // changeEvent

  public onEnd?: () => void; // endEvent

  /* fields */
  private width!: number; // 全体の長さ

  private _position = 0; // 現在の位置情報
  set position(position: number) {
    const nextPosition = this.updateLocation(position);
    this._position = nextPosition;
    this.handleChange(nextPosition);
  }

  get position(): number {
    return this._position;
  }

  private elementNum = 0; // 総エレメント巣

  private speedCalc: SpeedCalculator;

  private itemWidth!: number;

  private prevUpdateProps: { time: number; position: number } = {
    time: 0,
    position: 0,
  };

  private option!: Required<ISliderOptions>;

  private rafToken?: number; // requestAnimationFrameのキャンセルトークン

  private bezierFn!: (elapse: number) => number;

  /**
   * カルーセルクラス
   * @param width
   * @param isLoop 無限ループさせるかどうか
   */
  constructor(caches = 10) {
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
    option?: ISliderOptions
  ): void {
    this.option = { ...InitialSliderOptions, ...option };
    this.option.smooth = Math.max(this.option.smooth, 0.01);

    this.width = width;
    this.elementNum = viewElementNum;
    this.itemWidth = this.width / this.elementNum;
    this.position = this.option.initialIndex * this.itemWidth;
    this.bezierFn = this.option.bezier;
  }

  // タッチ or クリック 開始時に呼ばれるメソッド
  public start(position: number): void {
    cancelAnimationFrame(this.rafToken || 0);
    this.prevUpdateProps = {
      position,
      time: performance.now(),
    };
    this.speedCalc.reset();
  }

  // 場所のアップデート
  public update(position: number): void {
    const { position: pPosition, time: pTime } = this.prevUpdateProps;

    const moveOffset = pPosition - position;
    const prevTime = pTime - performance.now();

    this.position += moveOffset;
    this.speedCalc.add((moveOffset / prevTime) * 50);

    this.prevUpdateProps = {
      time: performance.now(),
      position,
    };
  }

  // タッチイベント終了時
  public end(): void {
    const speed = this.speedCalc.get() * 10 * this.option.smooth; // 重み付けの差
    const calcTime = Math.min(Math.max(Math.abs(speed), 100), 1000); // 速度の算出（最低２００ｍｓ）
    this.moveTo(speed, calcTime * this.option.smooth);
  }

  // 次のスライド
  public next(duration = 100): void {
    this.moveTo(this.itemWidth, duration);
  }

  // 前のスライド
  public prev(duration = 100): void {
    this.moveTo(-this.itemWidth, duration);
  }

  // TODO
  public setIndex(index: number, duration = 1000): void {
    const target = index * this.itemWidth;
    this.moveTo(target - this.position, duration);
  }

  // 慣性スクロール
  private moveTo(movementPosition: number, maxTime: number): void {
    // 最終到達地点が半分かそうじゃないかで分岐
    // ここが変
    const calcMovementPosition = this.option.isFit
      ? Math.floor(
          movementPosition -
            // koko
            (this.itemWidth - (this.position % this.itemWidth)) +
            // koko
            (this.itemWidth - (movementPosition % this.itemWidth))
        )
      : movementPosition;

    let prevTime = 0;
    let elapsedTime = 0;

    const position = this.position;

    const tick = (time: number): void => {
      elapsedTime += time - prevTime;
      const elapsedParsentage = elapsedTime / maxTime;
      if (elapsedParsentage >= 0.98) {
        cancelAnimationFrame(this.rafToken || 0);
        this.position = position - calcMovementPosition;
        this.onEnd && this.onEnd();
        return;
      }
      this.rafToken = requestAnimationFrame(tick);
      const bezierParsentage =
        this.bezierFn(elapsedParsentage) * calcMovementPosition;

      this.position = position - bezierParsentage * calcMovementPosition;
      prevTime = time;
    };

    this.rafToken = requestAnimationFrame((time: number) => {
      requestAnimationFrame(tick);
      prevTime = time;
    });
  }

  private handleChange(nextPosition: number): void {
    const index = Math.round(nextPosition / this.itemWidth);
    this.onChange && this.onChange(this.position, index);
  }

  // ロケーションのアップデート
  private updateLocation(nextPosition: number): number {
    if (this.option.isLoop) {
      return this.updateLocationIsLoop(nextPosition);
    }
    return this.updateLocationIsNotLoop(nextPosition);
  }

  private updateLocationIsLoop(nextPosition: number): number {
    const maxLength = this.itemWidth * this.elementNum;
    if (nextPosition < 0) {
      return maxLength + (this.position % maxLength);
    }
    return nextPosition % maxLength;
  }

  private updateLocationIsNotLoop(nextPosition: number): number {
    const maxLength = this.itemWidth * this.elementNum;
    const minPosition = 0;
    const maxPosition = maxLength - this.option.wrapperWidth;
    if (nextPosition < minPosition) {
      return 0;
    }
    if (nextPosition > maxPosition) {
      return maxLength - this.itemWidth - this.option.wrapperWidth;
    }
    return nextPosition;
  }
}
