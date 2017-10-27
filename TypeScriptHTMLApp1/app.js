var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
var TargetSegment = (function () {
    function TargetSegment(radius, marginWidth, text, segmentColor, marginColor, textColor) {
        this.radius = radius;
        this.marginWidth = marginWidth;
        this.text = text;
        this.segmentColor = segmentColor;
        this.marginColor = marginColor;
    }
    return TargetSegment;
}());
var CanvasInfo = (function () {
    function CanvasInfo(width, height) {
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(CanvasInfo.prototype, "centerX", {
        get: function () { return this.width / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasInfo.prototype, "centerY", {
        get: function () { return this.height / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasInfo.prototype, "radiusX", {
        get: function () { return this.width / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasInfo.prototype, "radiusY", {
        get: function () { return this.height / 2; },
        enumerable: true,
        configurable: true
    });
    return CanvasInfo;
}());
var TargetCtrl = (function () {
    function TargetCtrl(element) {
        this.element = element;
        var ctx = this.element.getContext("2d");
        this.paintTarget(ctx);
        //ctx.beginPath();
        //ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        //ctx.stroke();
    }
    TargetCtrl.getTargetSegments = function () {
        var DefaultMarginWidth = 0.01 / 2;
        return [
            new TargetSegment(1.0, DefaultMarginWidth, "1", new ColorUtils.RGB(226, 216, 217), new ColorUtils.RGB(0, 0, 0), new ColorUtils.RGB(0, 0, 0)),
            new TargetSegment(0.9, DefaultMarginWidth, "2", new ColorUtils.RGB(226, 216, 217), new ColorUtils.RGB(0, 0, 0), new ColorUtils.RGB(0, 0, 0)),
            new TargetSegment(0.8, DefaultMarginWidth, "3", new ColorUtils.RGB(54, 49, 53), new ColorUtils.RGB(255, 255, 255), new ColorUtils.RGB(0, 0, 0)),
            new TargetSegment(0.7, DefaultMarginWidth, "4", new ColorUtils.RGB(54, 49, 53), new ColorUtils.RGB(255, 255, 255), new ColorUtils.RGB(0, 0, 0))
        ];
    };
    TargetCtrl.prototype.paintTarget = function (ctx) {
        //ctx.beginPath();
        ////ctx.moveTo(100, 100);
        //ctx.arc(100, 100, 100, 0, Math.PI * 2);
        //ctx.lineWidth = 20;
        //ctx.stroke();
        var _this = this;
        //this.paintSegment(ctx, 60, 100, 100, 100);
        var canvasInfo = new CanvasInfo(100, 100);
        var targetSegments = TargetCtrl.getTargetSegments();
        targetSegments.forEach(function (s) {
            _this.paintSegmentTs(ctx, canvasInfo, s.radius, s.radius - s.marginWidth, s.marginColor);
            _this.paintSegmentTs(ctx, canvasInfo, s.radius - s.marginWidth, s.radius - 0.1, s.segmentColor);
        });
        //        this.paintSegmentTs(ctx, canvasInfo, 0.5, 0.6, ColorUtils.ColorHelper.hexToRgb('#f00000'));
    };
    TargetCtrl.prototype.paintSegment = function (ctx, startRadius, endRadius, centerX, centerY) {
        var middle = (endRadius + startRadius) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, middle, 0, Math.PI * 2);
        ctx.lineWidth = (endRadius - startRadius) / 2;
        ctx.stroke();
    };
    TargetCtrl.prototype.paintSegmentTs = function (ctx, canvasInfo, startRadius, endRadius, color) {
        ctx.beginPath();
        var startRadiusPx = startRadius * canvasInfo.radiusX;
        var endRadiusPx = endRadius * canvasInfo.radiusX;
        var middlePx = (startRadiusPx + endRadiusPx) / 2;
        ctx.arc(canvasInfo.centerX, canvasInfo.centerY, middlePx, 0, 2 * Math.PI);
        ctx.lineWidth = -endRadiusPx + startRadiusPx;
        ctx.strokeStyle = ColorUtils.ColorHelper.rgbToHex(color);
        ctx.stroke();
    };
    return TargetCtrl;
}());
window.onload = function () {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();
    var el = document.getElementById('myCanvas');
    var greeter = new TargetCtrl(el);
};
//# sourceMappingURL=app.js.map