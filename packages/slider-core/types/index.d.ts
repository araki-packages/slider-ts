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
    private _position;
    set position(position: number);
    get position(): number;
    private elementNum;
    private speedCalc;
    private itemWidth;
    private prevUpdateProps;
    private option;
    private rafToken?;
    private bezierFn;
    /**
     * カルーセルクラス
     * @param width
     * @param isLoop 無限ループさせるかどうか
     */
    constructor(caches?: number);
    /**
     * @param width 描画範囲
     * @param viewElementNum 描画範囲内のアイテム数
     * @param options.isLoop
     * @param options.isFit
     * @param options.initialIndex
     * @param options.smooth - 移動時のなめらかさ
     */
    init(width: number, viewElementNum: number, option?: ISliderOptions): void;
    start(position: number): void;
    update(position: number): void;
    end(): void;
    next(duration?: number): void;
    prev(duration?: number): void;
    setIndex(index: number, duration?: number): void;
    private moveTo;
    private handleChange;
    private updateLocation;
    private updateLocationIsLoop;
    private updateLocationIsNotLoop;
}

export { Slider };
