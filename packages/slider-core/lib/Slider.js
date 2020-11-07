"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Slider = void 0;
var SpeedCalculator_1 = require("./SpeedCalculator");
var common_1 = require("../constants/lib/common");
var Slider = /** @class */ (function () {
    /**
     * カルーセルクラス
     * @param width
     * @param isLoop 無限ループさせるかどうか
     */
    function Slider(caches) {
        if (caches === void 0) { caches = 10; }
        this._position = 0; // 現在の位置情報
        this.elementNum = 0; // 総エレメント巣
        this.prevUpdateProps = {
            time: 0,
            position: 0
        };
        this.speedCalc = new SpeedCalculator_1.SpeedCalculator(caches);
    }
    Object.defineProperty(Slider.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (position) {
            var nextPosition = this.updateLocation(position);
            this._position = nextPosition;
            this.handleChange(nextPosition);
        },
        enumerable: false,
        configurable: true
    });
    // 初期化イベント
    /**
     * @param width 描画範囲
     * @param viewElementNum 描画範囲内のアイテム数
     * @param options.isLoop
     * @param options.isFit
     * @param options.initialIndex
     * @param options.smooth - 移動時のなめらかさ
     */
    Slider.prototype.init = function (width, viewElementNum, option) {
        this.option = __assign(__assign({}, common_1.InitialSliderOptions), option);
        this.option.smooth = Math.max(this.option.smooth, 0.01);
        this.width = width;
        this.elementNum = viewElementNum;
        this.itemWidth = this.width / this.elementNum;
        this.position = this.option.initialIndex * this.itemWidth;
        this.bezierFn = this.option.bezier;
    };
    // タッチ or クリック 開始時に呼ばれるメソッド
    Slider.prototype.start = function (position) {
        cancelAnimationFrame(this.rafToken || 0);
        this.prevUpdateProps = {
            position: position,
            time: performance.now()
        };
        this.speedCalc.reset();
    };
    // 場所のアップデート
    Slider.prototype.update = function (position) {
        var _a = this.prevUpdateProps, pPosition = _a.position, pTime = _a.time;
        var moveOffset = pPosition - position;
        var prevTime = pTime - performance.now();
        this.position += moveOffset;
        this.speedCalc.add((moveOffset / prevTime) * 50);
        this.prevUpdateProps = {
            time: performance.now(),
            position: position
        };
    };
    // タッチイベント終了時
    Slider.prototype.end = function () {
        var speed = this.speedCalc.get() * 10 * this.option.smooth; // 重み付けの差
        var calcTime = Math.min(Math.max(Math.abs(speed), 100), 1000); // 速度の算出（最低２００ｍｓ）
        this.moveTo(speed, calcTime * this.option.smooth);
    };
    // 次のスライド
    Slider.prototype.next = function (duration) {
        if (duration === void 0) { duration = 100; }
        this.moveTo(this.itemWidth, duration);
    };
    // 前のスライド
    Slider.prototype.prev = function (duration) {
        if (duration === void 0) { duration = 100; }
        this.moveTo(-this.itemWidth, duration);
    };
    // TODO
    Slider.prototype.setIndex = function (index, duration) {
        if (duration === void 0) { duration = 1000; }
        var target = index * this.itemWidth;
        this.moveTo(target - this.position, duration);
    };
    // 慣性スクロール
    Slider.prototype.moveTo = function (movementPosition, maxTime) {
        var _this = this;
        // 最終到達地点が半分かそうじゃないかで分岐
        // ここが変
        var calcMovementPosition = this.option.isFit
            ? Math.floor(movementPosition -
                // koko
                (this.itemWidth - (this.position % this.itemWidth)) +
                // koko
                (this.itemWidth - (movementPosition % this.itemWidth)))
            : movementPosition;
        var startTime = null;
        var tick = function (time) {
            if (startTime === null)
                startTime = time;
            var elapsedTime = time - startTime;
            if (elapsedTime >= maxTime) {
                cancelAnimationFrame(_this.rafToken || 0);
                _this.position = _this.position - calcMovementPosition;
                _this.onEnd && _this.onEnd();
                return;
            }
            var elapsedParsentage = elapsedTime / maxTime;
            var bezierParsentage = _this.bezierFn(elapsedParsentage);
            _this.position = _this.position - bezierParsentage * calcMovementPosition;
            _this.rafToken = requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    Slider.prototype.handleChange = function (nextPosition) {
        var index = Math.round(nextPosition / this.itemWidth);
        this.onChange && this.onChange(this.position, index);
    };
    // ロケーションのアップデート
    Slider.prototype.updateLocation = function (nextPosition) {
        if (this.option.isLoop) {
            return this.updateLocationIsLoop(nextPosition);
        }
        return this.updateLocationIsNotLoop(nextPosition);
    };
    Slider.prototype.updateLocationIsLoop = function (nextPosition) {
        var maxLength = this.itemWidth * (this.elementNum - 1);
        if (nextPosition < 0) {
            return maxLength + (this.position % maxLength);
        }
        return nextPosition % maxLength;
    };
    Slider.prototype.updateLocationIsNotLoop = function (nextPosition) {
        var maxLength = this.itemWidth * this.elementNum;
        var minPosition = 0;
        var maxPosition = maxLength - this.option.wrapperWidth;
        if (nextPosition < minPosition) {
            return 0;
        }
        if (nextPosition > maxPosition) {
            return maxLength - this.itemWidth - this.option.wrapperWidth;
        }
        return nextPosition;
    };
    return Slider;
}());
exports.Slider = Slider;
