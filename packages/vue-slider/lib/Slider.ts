import { SpeedCalculator } from './SpeedCalculator';
import { SliderOptions } from '../interfaces/lib/common';
import { InitialSliderOptions } from '../constants/lib/common';

export class Slider {
  private width!: number; // 全体の長さ
  private isLoop!: boolean; // ループするかどうか
  private isFit!: boolean;
  private copyElementNum!: number; // コピーした画像数
  private offsetLeft!: number;
  private currentX = 0; // 現在の位置情報
  private elementNum = 0; // 総エレメント巣
  private speed: number = 0;
  private speedCalc: SpeedCalculator;

  private itemWidth!: number;
  private deltaTime = 0; // 時間の差分
  private deltaMove = 0; // updateの移動値の差分
  private movementPosition: number = 0;

  private animationID?: number;
  public onChange?: (x: number, index: number) => void; // changeEvent
  public onEnd?: () => void; // endEvent

  /**
   * カルーセルクラス
   * @param width
   * @param isLoop 無限ループさせるかどうか
   */
  constructor() {
    this.speedCalc = new SpeedCalculator(5);
  }

  // 初期化イベント
  public init(
    width: number,
    viewElementNum: number,
    copyElementNum: number,
    options?: SliderOptions,
  ) {
    const setOption = {...InitialSliderOptions, ...options};
    this.width = width;
    this.elementNum = viewElementNum;
    this.copyElementNum = copyElementNum;
    this.itemWidth = this.width / (this.elementNum + this.copyElementNum * 2);
    this.isLoop = setOption.isLoop;
    this.offsetLeft = setOption.offsetLeft;
    this.isFit = setOption.isFit;

    this.currentX = -setOption.initialIndex * this.itemWidth;
    this.handleChange();
  }

  // タッチ or クリック 開始時に呼ばれるメソッド
  public start(x: number) {
    cancelAnimationFrame(this.animationID || 0);
    this.deltaMove = x;
    this.movementPosition = 0;
    this.speedCalc.reset();
  }

  // 場所のアップデート
  public update(x: number) {
    this.deltaMove = x - this.deltaMove;
    this.deltaTime = this.deltaTime - performance.now();
    this.currentX += this.deltaMove;

    this.updateLocation();
    this.handleChange();

    this.speedCalc.add(this.deltaMove / this.deltaTime * 50);
    this.movementPosition += this.deltaMove;
    this.deltaMove = 0;
    this.deltaTime = performance.now();
  }

  public handleChange() {
    const position = this.currentX + this.offsetLeft;
    const index = Math.floor(Math.abs(this.currentX) / this.itemWidth) % (this.elementNum + this.copyElementNum * 2);
    this.onChange && this.onChange(position - this.copyElementNum * this.itemWidth, index);
  }

  // ロケーションのアップデート
  public updateLocation() {
    const maxLength = this.itemWidth * this.elementNum;

    if (this.isLoop) {
      if (this.currentX < maxLength) {
        this.currentX = this.currentX % maxLength;
      }
      if (this.currentX > 0) {
        this.currentX = maxLength + (this.currentX % maxLength);
      }
    } else {
      if (this.currentX < maxLength + this.itemWidth) {
        this.currentX = maxLength + this.itemWidth;
      }
      if (this.currentX > 0) {
        this.currentX = -1;
      }
    }
  }

  // タッチイベント終了時
  public end() {
    this.speed = this.speedCalc.get();
    // 一定以上のスピードの場合は感性スクロールをオンにする。
    if (this.speed > 200) {
      this.decraition();
      return;
    }
    // 決め打ちアニメーション
    if (this.movementPosition < this.itemWidth / 6 && this.movementPosition > 0) {
      this.speed = this.itemWidth / 8;
      this.decraition();
      return;
    }
    if (this.movementPosition > -this.itemWidth / 6 && this.movementPosition < 0) {
      this.speed = 0;
      this.decraition();
      return;
    }
    if (this.movementPosition < this.itemWidth / 2 && this.movementPosition > 0) {
      this.prev();
      return;
    }
    if (this.movementPosition > -this.itemWidth && this.movementPosition < 0) {
      this.next();
      return;
    }

    // 動作が1未満の場合はストップ
    if (Math.abs(this.movementPosition) < 5) {
      // TODO: 中途半端な場所の場合は、変更する。
      // TODO 場当たり的な処理のため後日原因を探し、修正を行う。
      // setTimeout(() => {
      //   this.next();
      // }, 100);
      return;
    }

    // 速さが1未満の場合はストップ
    if (Math.abs(this.speed) < 5) {
      this.speed = 0;
      this.decraition();
      return;
    }
    this.decraition();
  }

  // 次のスライド
  public next() {
    this.speed = this.itemWidth / 8;
    this.decraition();
  }

  // 前のスライド
  public prev() {
    this.speed = -this.itemWidth / 16;
    this.decraition();
  }

  // 慣性スクロール
  private decraition() {
    let deltaTime = 0;
    let elapsedTime = 0;
    const position = this.currentX;
    const speed = this.speed * 10 * -1;
    const movementPosition = this.isFit ? (
        speed
          - (speed % this.itemWidth)
          - (position % this.itemWidth)
      ) : speed;
    const maxTime = Math.max(Math.abs(speed / 5), 200); // 速度の算出（最低２００ｍｓ）
    const tick = (time: number) => {
      if (elapsedTime > maxTime) {
        this.currentX = position + movementPosition;
        this.updateLocation();
        this.handleChange();
        this.onEnd && this.onEnd();
        return;
      }
      deltaTime = time - deltaTime;
      elapsedTime += deltaTime;
      const offsetPosition = Math.sin((elapsedTime / maxTime) * (Math.PI / 2))
      const movement = offsetPosition * movementPosition;
      this.currentX = position + movement;
      this.updateLocation();
      this.handleChange();
      deltaTime = time;
      this.animationID = window.requestAnimationFrame((time) => {
        tick(time)
      });
    }

    this.animationID = window.requestAnimationFrame((time: number) => {
      deltaTime = time;
      tick(time);
    });

  }
}