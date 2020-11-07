"use strict";
exports.__esModule = true;
exports.SpeedCalculator = void 0;
var SpeedCalculator = /** @class */ (function () {
    function SpeedCalculator(cacheNum) {
        this.cacheNum = cacheNum;
        this.speedList = [];
    }
    SpeedCalculator.prototype.reset = function () {
        this.speedList = [];
    };
    SpeedCalculator.prototype.add = function (speedNum) {
        this.speedList.push(speedNum);
        if (this.speedList.length > this.cacheNum) {
            this.speedList.shift();
        }
    };
    SpeedCalculator.prototype.get = function () {
        if (this.speedList.length === 0)
            return 0;
        var result = this.speedList.reduce(function (prev, next) {
            return prev + next;
        }) / this.speedList.length;
        return result;
    };
    return SpeedCalculator;
}());
exports.SpeedCalculator = SpeedCalculator;
