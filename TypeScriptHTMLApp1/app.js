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
        this.setupEvents();
        this.UpdateCanvasWidthHeight();
        var ctx = this.element.getContext("2d");
        this.paintTarget(ctx);
        //ctx.beginPath();
        //ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        //ctx.stroke();
    }
    TargetCtrl.prototype.setupEvents = function () {
        var _this = this;
        //this.element.onmousedown((ev: MouseEvent) =>  this.OnMouseDown(ev) );
        this.element.onmousedown = function (ev) { _this.OnMouseDown(ev); };
    };
    TargetCtrl.prototype.OnMouseDown = function (ev) {
        return;
    };
    TargetCtrl.prototype.UpdateCanvasWidthHeight = function () {
        this.canvasWidth = this.element.width;
        this.canvasHeight = this.element.height;
    };
    TargetCtrl.getTargetSegments = function () {
        var defaultMarginWidth = 0.01 / 2;
        return [
            new TargetSegment(1.0, defaultMarginWidth, "1", TargetCtrl.WhiteSegment, /* Segment color */ TargetCtrl.Black, /* Margin color */ TargetCtrl.WhiteSegmentText),
            new TargetSegment(0.9, defaultMarginWidth, "2", TargetCtrl.WhiteSegment, TargetCtrl.Black, TargetCtrl.WhiteSegmentText),
            new TargetSegment(0.8, defaultMarginWidth, "3", TargetCtrl.BlackSegment, TargetCtrl.White, TargetCtrl.BlackSegmentText),
            new TargetSegment(0.7, defaultMarginWidth, "4", TargetCtrl.BlackSegment, TargetCtrl.White, TargetCtrl.BlackSegmentText),
            new TargetSegment(0.6, defaultMarginWidth, "5", TargetCtrl.BlueSegment, TargetCtrl.Black, TargetCtrl.BlueSegmentText),
            new TargetSegment(0.5, defaultMarginWidth, "6", TargetCtrl.BlueSegment, TargetCtrl.Black, TargetCtrl.BlueSegmentText),
            new TargetSegment(0.4, defaultMarginWidth, "7", TargetCtrl.RedSegment, TargetCtrl.Black, TargetCtrl.RedSegmentText),
            new TargetSegment(0.3, defaultMarginWidth, "8", TargetCtrl.RedSegment, TargetCtrl.Black, TargetCtrl.RedSegmentText),
            new TargetSegment(0.2, defaultMarginWidth, "9", TargetCtrl.GoldSegment, TargetCtrl.Black, TargetCtrl.GoldSegmentText),
            new TargetSegment(0.1, defaultMarginWidth, "10", TargetCtrl.GoldSegment, TargetCtrl.Black, TargetCtrl.GoldSegmentText)
        ];
    };
    TargetCtrl.prototype.paintTarget = function (ctx) {
        //ctx.beginPath();
        ////ctx.moveTo(100, 100);
        //ctx.arc(100, 100, 100, 0, Math.PI * 2);
        //ctx.lineWidth = 20;
        //ctx.stroke();
        //this.paintSegment(ctx, 60, 100, 100, 100);
        var canvasInfo = new CanvasInfo(this.canvasWidth, this.canvasHeight);
        var targetSegments = TargetCtrl.getTargetSegments();
        for (var i = 0; i < targetSegments.length; ++i) {
            var s = targetSegments[i];
            var segmentEndRadius;
            if (i < targetSegments.length - 1) {
                segmentEndRadius = targetSegments[i + 1].radius;
            }
            else {
                segmentEndRadius = 0;
            }
            this.paintSegmentTs(ctx, canvasInfo, s.radius, s.radius - s.marginWidth, s.marginColor);
            this.paintSegmentTs(ctx, canvasInfo, s.radius - s.marginWidth, segmentEndRadius, s.segmentColor);
        }
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
TargetCtrl.WhiteSegment = new ColorUtils.RGB(226, 216, 217);
TargetCtrl.BlackSegment = new ColorUtils.RGB(54, 49, 53);
TargetCtrl.BlueSegment = new ColorUtils.RGB(68, 173, 228);
TargetCtrl.RedSegment = new ColorUtils.RGB(231, 37, 35);
TargetCtrl.RedSegmentText = new ColorUtils.RGB(176, 127, 113);
TargetCtrl.GoldSegment = new ColorUtils.RGB(251, 209, 3);
TargetCtrl.GoldSegmentText = new ColorUtils.RGB(165, 135, 11);
TargetCtrl.WhiteSegmentText = new ColorUtils.RGB(111, 106, 103);
TargetCtrl.BlackSegmentText = new ColorUtils.RGB(181, 177, 174);
TargetCtrl.BlueSegmentText = new ColorUtils.RGB(0, 56, 85);
TargetCtrl.Black = new ColorUtils.RGB(0, 0, 0);
TargetCtrl.White = new ColorUtils.RGB(255, 255, 255);
window.onload = function () {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();
    var el = document.getElementById('myCanvas');
    var greeter = new TargetCtrl(el);
};
//# sourceMappingURL=app.js.map