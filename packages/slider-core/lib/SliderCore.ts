import { SpeedCalculator } from "./SpeedCalculator";
import { ISliderOptions, MoveRelation } from "./interfaces";
import { InitialSliderOptions } from "./constants";
import { deltaAnimation } from "./util/";

export class Slider {
  /* event listeners */
  public onChange?: (x: number, index: number) => void; // changeEvent
  public onEnd?: () => void; // endEvent

  /* fields */
  private width!: number; // 全体の長さ
  private elementNum = 0; // 総エレメント巣
  private itemWidth: number = 0; // アイテムの横幅

  private _position = 0; // 現在の位置情報
  private cancelAnimation: () => void = () => {}; // requestAnimationFrameのキャンセルトークン
  private option!: Required<ISliderOptions>;
  private isAnimating: boolean = false;

  set position(position: number) {
    const nextPosition = this.updateLocation(position);
    this._position = nextPosition;
    this.onChange && this.onChange(nextPosition, this.currentIndex);
  }

  get position(): number {
    return this._position;
  }

  public get currentIndex(): number {
    // TODO 式の見直しが必要。
    return Math.round(this._position / this.itemWidth + 0.1);
  }

  private speedCalc: SpeedCalculator;
  private prevMoveRelation: MoveRelation = {
    verocity: 0,
    time: 0,
    distance: 0,
  };

  /**
   * カルーセルクラス
   * @param width
   * @param isLoop 無限ループさせるかどうか
   * @param width 描画範囲
   * @param viewElementNum 描画範囲内のアイテム数
   * @param options.isLoop
   * @param options.isFit
   * @param options.initialIndex
   * @param options.smooth - 移動時のなめらかさ
   */
  public constructor(
    width: number,
    viewElementNum: number,
    option?: ISliderOptions
  ) {
    this.speedCalc = new SpeedCalculator(10);
    this.option = { ...InitialSliderOptions, ...option };
    this.option.smooth = Math.max(this.option.smooth, 0.01);
    this.width = width;
    this.elementNum = viewElementNum;
    this.itemWidth = this.width / this.elementNum;
    this.position = this.option.initialIndex * this.itemWidth;
  }

  // タッチ or クリック 開始時に呼ばれるメソッド
  public start(position: number): void {
    this.cancelAnimation();
    this.prevMoveRelation = {
      distance: position,
      verocity: 0,
      time: performance.now(),
    };
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
      time: deltaTime,
      distance: deltaDistance,
      verocity: verocity,
    });
  }

  // タッチイベント終了時
  public end(): void {
    const average = this.speedCalc.getNextPosition(); // 重み付けの差
    this.speedCalc.reset();
    this.moveTo(average.distance, average.time);
  }

  /**
   * next index position
   * @summary verocity = -currentPosition + targetPosition / time
   */
  public next(time = 100): void {
    if (this.isAnimating) return;
    this.moveTo(this.itemWidth, time);
  }

  /**
   * prev index  position
   * @summary verocity = -currentPosition + targetPosition / time
   */
  public prev(time = 100): void {
    if (this.isAnimating) return;
    this.moveTo(-this.itemWidth, time);
  }

  /**
   * go to target index
   * @summary verocity = -currentPosition + targetPosition / time
   */
  public moveToByIndex(index: number, time = 1000): void {
    if (this.isAnimating) return;

    const nextPosition =
      -(this.position % this.itemWidth) - this.itemWidth * index;
    this.moveTo(nextPosition, time);
  }

  /**
   * 慣性スクロール
   */
  public moveTo(distance: number, time: number): void {
    this.cancelAnimation();
    const currentPosition = this.position;

    const calcPosition = (parcentage: number) => {
      if (this.option.isFit) {
        const targetIndex = Math.round((currentPosition + distance) / this.itemWidth);
        const targetPosition = targetIndex * this.itemWidth;
        return currentPosition + (-currentPosition + targetPosition) * parcentage;
      }
      return currentPosition + distance * parcentage;
    }

    this.cancelAnimation = deltaAnimation((_, elapsedTime) => {
      if (elapsedTime > time) {
        this.cancelAnimation();
        this.position = calcPosition(1);
        this.handleEnd();
        return;
      }
      const persentage = elapsedTime / time;
      this.position = calcPosition(this.option.bezier(persentage));
    });
  }

  // positionのバリデーション
  private updateLocation(nextPosition: number): number {
    // ループ時
    if (this.option.isLoop) {
      const maxLength = this.itemWidth * (this.elementNum - 1);
      return (maxLength + (nextPosition % maxLength)) % maxLength;
    }
    if (nextPosition < 0) return 0; // 0未満拒否
    // 否ループ時
    // 1枚は最低表示させるようにする
    const maxLength = this.itemWidth * (this.elementNum - 1);
    if (nextPosition > maxLength) return maxLength;
    return nextPosition;
  }

  private handleEnd() {
    this.onEnd && this.onEnd();
  }
}
