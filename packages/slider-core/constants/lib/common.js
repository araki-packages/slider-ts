"use strict";
exports.__esModule = true;
exports.InitialSliderOptions = void 0;
var cubic_bezier_1 = require("@takumus/cubic-bezier");
var EASE_OUT = [0, 0, 0.58, 1];
exports.InitialSliderOptions = {
    isLoop: true,
    wrapperWidth: 0,
    isFit: false,
    initialIndex: 0,
    smooth: 1,
    bezier: cubic_bezier_1["default"].apply(void 0, EASE_OUT)
};
