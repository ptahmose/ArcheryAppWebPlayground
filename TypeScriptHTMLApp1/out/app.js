//import $ from 'jquery'
//import $ = require("jquery");
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
    function TargetCtrl(element, svg) {
        this.curZoom = 1;
        this.element = element;
        this.svgElement = svg;
        this.setupEvents();
        this.UpdateCanvasWidthHeight();
        var ctx = this.element.getContext("2d");
        ctx.setTransform(this.canvasWidth, 0, 0, this.canvasHeight, 0, 0);
        this.paintTarget(ctx);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.backupElement = document.createElement("canvas");
        this.backupElement.width = this.canvasWidth;
        this.backupElement.height = this.canvasHeight;
        var ctxBackup = this.backupElement.getContext("2d");
        ctxBackup.drawImage(this.element, 0, 0, this.canvasWidth, this.canvasHeight);
        this.drawHits();
    }
    TargetCtrl.prototype.insertHitsGroup = function () {
        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        group.setAttribute('transform', 'scale(1024,1024)');
        var hit = document.createElementNS("http://www.w3.org/2000/svg", 'use');
        hit.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#shape');
        hit.setAttribute('transform', 'translate(0.25,0.25) scale(0.1,0.1)');
        group.appendChild(hit);
        this.svgElement.appendChild(group);
    };
    TargetCtrl.prototype.drawHits = function () {
        this.insertHitsGroup();
        //var circleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        //circleElement.setAttribute('cx', "200");
        //circleElement.setAttribute('cy', "200");
        //circleElement.setAttribute('r', "40");
        //circleElement.setAttribute('stroke', "green");
        //circleElement.setAttribute('stroke-width', "4");
        //circleElement.setAttribute('fill', "yellow");
        //this.svgElement.appendChild(circleElement);
    };
    TargetCtrl.prototype.setupEvents = function () {
        var _this = this;
        this.element.onmousedown = function (ev) { _this.OnMouseDown(ev); };
        this.element.onmouseup = function (ev) { _this.OnMouseUp(ev); };
    };
    TargetCtrl.prototype.setTransform = function (ctx, centerX, centerY, zoom) {
        zoom = 1 / zoom;
        // calculate the coordinate of the center of the scaled rectangle
        var xP = (this.canvasWidth * zoom) / 2;
        var yP = (this.canvasHeight * zoom) / 2;
        var distX = (this.canvasWidth / 2) - centerX;
        var distY = (this.canvasHeight / 2) - centerY;
        // and now we need to translate (xP,yP) to the center
        var xDiff = xP - centerX;
        var yDiff = yP - centerY;
        xDiff -= distX * zoom;
        yDiff -= distY * zoom;
        ctx.setTransform(zoom, 0, 0, zoom, -xDiff, -yDiff);
    };
    TargetCtrl.prototype.getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    TargetCtrl.prototype.OnMouseDown = function (ev) {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        this.runZoomInAnimation(ev, this.curZoom, 0.1);
    };
    TargetCtrl.prototype.OnMouseUp = function (ev) {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        this.runZoomInAnimation(ev, this.curZoom, 1);
    };
    TargetCtrl.prototype.runZoomInAnimation = function (ev, startZoom, endZoom) {
        var _this = this;
        var pos = this.getMousePos(this.element, ev);
        this.zoomAnimation = $({ xyz: startZoom });
        /*$({ xyz: startZoom })*/ this.zoomAnimation.animate({ xyz: endZoom }, {
            duration: 350,
            step: function (now, fx) {
                //console.log("anim now " + now);
                var ctx = _this.element.getContext("2d");
                _this.setTransform(ctx, pos.x, pos.y, now);
                ctx.drawImage(_this.backupElement, 0, 0, _this.canvasWidth, _this.canvasHeight);
                _this.curZoom = now;
            },
            complete: function (now, fx) {
                var ctx = _this.element.getContext("2d");
                _this.drawZoomed(ctx, pos.x, pos.y, endZoom);
                _this.curZoom = endZoom;
                _this.zoomAnimation = null;
            }
        });
    };
    TargetCtrl.prototype.drawZoomed = function (ctx, centerX, centerY, zoom) {
        var xDiff = centerX / zoom - centerX;
        var yDiff = centerY / zoom - centerY;
        ctx.setTransform(this.canvasWidth / zoom, 0, 0, this.canvasHeight / zoom, -xDiff, -yDiff);
        this.paintTarget(ctx);
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
        var canvasInfo = new CanvasInfo(1, 1);
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
        /*
        var img = new Image();
        img.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        }
        */
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
    var svg = document.getElementById('mySvg');
    //var el2 = <HTMLCanvasElement>document.getElementById('myCanvas2');
    var greeter = new TargetCtrl(el, svg);
};
//# sourceMappingURL=app.js.map