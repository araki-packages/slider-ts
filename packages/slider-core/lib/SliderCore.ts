import { SpeedCalculator } from "./SpeedCalculator";
import { ISliderOptions, MoveRelation } from "./interfaces";
import { InitialSliderOptions } from "./constants";

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

  private prevMoveRelation: MoveRelation = {
    verocity: 0,
    time: 0,
    distance: 0,
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
    this.prevMoveRelation = {
      distance: position,
      verocity: 0,
      time: performance.now(),
    };
    this.speedCalc.reset(performance.now());
  }

  // 場所のアップデート
  public update(currentDistance: number): void {
    const { distance: prevDistance, time: prevTime } = this.prevMoveRelation;
    const currentTime = performance.now();

    const deltaDistance = -prevDistance + currentDistance;
    const deltaTime = -prevTime + currentTime;

    // const deltaTime = prevTime - performance.now();
    this.position += deltaDistance;
    const verocity = deltaDistance / deltaTime;

    this.prevMoveRelation = {
      time: currentTime,
      distance: currentDistance,
      verocity: verocity,
    };

    this.speedCalc.add({
      time: currentTime,
      distance: currentDistance,
      verocity: verocity,
    });
  }

  // タッチイベント終了時
  public end(): void {
    const currentSpeed = this.speedCalc.getAverageVerocity(); // 重み付けの差
    this.moveTo(currentSpeed);
  }

  // 次のスライド
  public next(duration = 100): void {
    console.log(duration,  '未実装');
  }

  // 前のスライド
  public prev(duration = 100): void {
    console.log(duration,  '未実装');
  }

  public setIndex(index: number, duration = 1000): void {
    console.log(index, duration,  '未実装');
  }

  // 慣性スクロール
  public moveTo(verocity: number): void {
    let prevTime: null | number = null;
    let currentVerosity = verocity;

    if (verocity === 0){
      return
    }
    const tick = (currentTime: number) => {
      if (prevTime === null) prevTime = currentTime - 15; // 1 frame?
      // const deltaTime = prevTime - currentTime;
      if (Math.abs(currentVerosity) < 0.1) {
        this.onEnd && this.onEnd();
        return;
      }
      // 0.2を可変させることが大事？
      //
      this.position += currentVerosity * (-prevTime + currentTime);
      currentVerosity += (-verocity + 0) / 100;
      prevTime = currentTime;
      window.requestAnimationFrame(tick);
    }
    this.rafToken = window.requestAnimationFrame(tick)
    // 結果 0 - currentSpeed * elapsed
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
    const maxLength = this.itemWidth * (this.elementNum - 1);
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
