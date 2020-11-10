interface ISliderOptions {
    isLoop?: boolean;
    isFit?: boolean;
    wrapperWidth?: number;
    initialIndex?: number;
    smooth?: number;
    bezier?: (elapse: number) => number;
}

declare class Slider {
    onChange?: (x: number, index: number) => void;
    onEnd?: () => void;
    private width;
    private elementNum;
    private itemWidth;
    private _position;
    private cancelAnimation;
    private option;
    private isAnimating;
    set position(position: number);
    get position(): number;
    get currentIndex(): number;
    private speedCalc;
    private prevMoveRelation;
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
    constructor(width: number, viewElementNum: number, option?: ISliderOptions);
    start(position: number): void;
    update(currentDistance: number): void;
    end(): void;
    /**
     * next index position
     * @summary verocity = -currentPosition + targetPosition / time
     */
    next(time?: number): void;
    /**
     * prev index  position
     * @summary verocity = -currentPosition + targetPosition / time
     */
    prev(time?: number): void;
    /**
     * go to target index
     * @summary verocity = -currentPosition + targetPosition / time
     */
    moveToByIndex(index: number, time?: number): void;
    /**
     * 慣性スクロール
     */
    moveTo(distance: number, time: number, isFit: boolean): void;
    private updateLocation;
    private handleEnd;
}

export { Slider };
