//import $ from 'jquery'
//import $ = require("jquery");
/*class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}*/
var TargetSegment = /** @class */ (function () {
    function TargetSegment(radius, marginWidth, text, segmentColor, marginColor, textColor) {
        this.radius = radius;
        this.marginWidth = marginWidth;
        this.text = text;
        this.segmentColor = segmentColor;
        this.marginColor = marginColor;
    }
    return TargetSegment;
}());
var CanvasInfo = /** @class */ (function () {
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
var TargetCtrl = /** @class */ (function () {
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
        this.insertHitsGroup();
        var h = [{ x: 0.25, y: 0.25 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.5, y: 0.5 }];
        this.shotPositions = h;
        this.drawHits(h);
        this.crosshairElement = this.svgElement.getElementById('crosshairGroup');
    }
    TargetCtrl.prototype.addShot = function (x, y) {
        this.shotPositions.push({ x: x, y: y });
        this.drawHits(this.shotPositions);
        //throw new Error("Method not implemented.");
    };
    TargetCtrl.prototype.insertHitsGroup = function () {
        //var groupWithClip = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        //groupWithClip.setAttribute('style', "clip-path: url(#clipPath);");
        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        group.setAttribute('transform', 'scale(1024,1024)');
        // group.setAttribute('style', "clip-path: url(#clipPath);");
        this.hitGroup = group;
        //var hit = document.createElementNS("http://www.w3.org/2000/svg", 'use');
        //hit.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#shape');
        //hit.setAttribute('transform', 'translate(0.25,0.25) scale(0.1,0.1)');
        //group.appendChild(hit);
        //groupWithClip.appendChild(group);
        this.svgElement.getElementById('hits').appendChild(group);
        //this.svgElement.appendChild(group);
    };
    TargetCtrl.prototype.drawHits = function (hitCoordinates) {
        var _this = this;
        while (this.hitGroup.firstChild) {
            this.hitGroup.removeChild(this.hitGroup.firstChild);
        }
        hitCoordinates.forEach(function (v) {
            var hit = document.createElementNS("http://www.w3.org/2000/svg", 'use');
            hit.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#shape');
            hit.setAttribute('transform', 'translate(' + v.x.toString() + ',' + v.y.toString() + ') scale(0.1,0.1)');
            _this.hitGroup.appendChild(hit);
        });
    };
    TargetCtrl.prototype.setupEvents = function () {
        var _this = this;
        this.element.onmousedown = function (ev) { _this.OnMouseDown(ev); };
        this.element.onmouseup = function (ev) { _this.OnMouseUp(ev); };
        this.element.onmousemove = function (ev) { _this.OnMouseMove(ev); };
        this.element.addEventListener("touchstart", function (ev) { _this.OnTouchStart(ev); }, false);
        this.element.addEventListener("touchmove", function (ev) { _this.OnTouchMove(ev); }, false);
        this.element.addEventListener("touchend", function (ev) { _this.OnTouchEnd(ev); }, false);
        //this.element.ontouchstart=(ev:TouchEvent)=>{this.OnTouchStart(ev);}
        //this.element.ontouchmove=(ev:TouchEvent)=>{TouchEvent}
        //this.element.ontouchend=(ev:TouchEvent)=>{this.OnTouchEnd(ev);}
        // this.element.addEventListener("contextmenu", function (e) {
        //    // e.target.innerHTML = "Show a custom menu instead of the default context menu";
        //     e.preventDefault();    // Disables system menu
        //   }, false);
        this.element.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, true);
        this.element.addEventListener("MSHoldVisual", function (e) {
            e.preventDefault();
        }, false);
    };
    // private handleOnTouchStart = (evt:TouchEvent) => { // Since you want to pass this around  
    //     this.OnTouchStart(evt);
    // }
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
    TargetCtrl.prototype.getMousePosNormalized = function (canvas, evt) {
        var pos = this.getMousePos(canvas, evt);
        return { x: pos.x / this.canvasWidth, y: pos.y / this.canvasHeight };
    };
    TargetCtrl.prototype.setHitGraphicsTransform = function (centerX, centerY, zoom) {
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
        var scale = 1 / zoom;
        //var t = 'scale(1024,1024) scale(' + zoom + ',' + zoom + ') translate(' + (-xDiff).toString() + ',' + (-yDiff).toString() + ')';
        //var t = 'scale(1024,1024)  scale(' + scale + ',' + scale + ')';
        //var t = 'scale(1024,1024)  translate(' + (-xDiff).toString() + ',' + (-yDiff).toString() + ')';
        //zoom = 2;
        //var t = 'scale(1024,1024) scale(' + zoom + ',' + zoom + ') translate(' + (-xDiff / 1024) + ',' + (-yDiff / 1024)+')';
        //var t = 'translate(-512,-512) scale(2048,2048)  ';
        var xx = this.canvasWidth / 2 * zoom - ((this.canvasWidth / 2) /*+ (this.canvasWidth / 4)*/); //+((this.canvasWidth) / 2-centerX);
        var yy = this.canvasHeight / 2 * zoom - ((this.canvasHeight / 2) /*+ (this.canvasWidth / 4)*/); //+((this.canvasHeight) / 2-centerY);
        //var t = 'translate(-1536,-1536) scale(4096,4096)  ';
        var wx = this.canvasWidth * zoom;
        var wy = this.canvasHeight * zoom;
        var xx1 = (centerX / 1024) * wx - centerX;
        var yy1 = (centerY / 1024) * wy - centerY;
        var t = 'translate(' + (-xx1) + ',' + (-yy1) + ') scale(' + wx + ',' + wy + ')  ';
        //var t = 'translate(-1524,-1524) scale(4096,4096)  ';
        /*var s = 1024 * zoom;
        var t = 'translate(' + (-xDiff) + ',' + (-yDiff) + ') scale(' + s + ',' + s + ')';*/
        this.hitGroup.setAttribute('transform', t);
    };
    TargetCtrl.prototype.OnMouseDown = function (ev) {
        // if (ev.touches && ev.touches.length > 0) {
        // }
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        this.runZoomInAnimation(ev, this.curZoom, 0.1);
        // this.setHitGraphicsTransform(512, 512, 1.0 / 3);
    };
    TargetCtrl.prototype.OnMouseUp = function (ev) {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        //this.runZoomInAnimation(ev, this.curZoom, 1);
        var pos = this.getMousePosNormalized(this.element, ev);
        var posTransformed = this.TransformToUnzoomedNormalized(pos);
        this.addShot(posTransformed.x, posTransformed.y);
        this.runZoomInAnimation(ev, this.curZoom, 1);
    };
    TargetCtrl.prototype.OnTouchStart = function (ev) {
        ev.preventDefault();
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        //throw new Error("Method not implemented.");
        console.log("Touch-Start" + ev.touches.length);
        var rect = this.element.getBoundingClientRect();
        var pos = { x: ev.touches[0].clientX - rect.left, y: ev.touches[0].clientY - rect.top };
        console.log("Touch-Start" + ev.touches.length + " x=" + pos.x + " y=" + pos.y);
        this.runZoomInAnimation_(pos, this.curZoom, 0.1);
    };
    TargetCtrl.prototype.OnTouchMove = function (ev) {
        //throw new Error("Method not implemented.");
        console.log("Touch-Move: " + ev.touches.length);
        var rect = this.element.getBoundingClientRect();
        var pos = { x: ev.touches[0].clientX - rect.left, y: ev.touches[0].clientY - rect.top };
        this.crosshairElement.setAttribute('transform', 'scale(1024,1024) translate(' + (pos.x - 1024 / 2) / 1024 + ',' + (pos.y - 1024 / 2) / 1024 + ') ');
        ev.preventDefault();
    };
    TargetCtrl.prototype.OnMouseMove = function (ev) {
        ev.preventDefault();
        //console.debug(ev.x);
        //console.debug(ev.y);
        var pos = this.getMousePos(this.element, ev);
        this.crosshairElement.setAttribute('transform', 'scale(1024,1024) translate(' + (pos.x - 1024 / 2) / 1024 + ',' + (pos.y - 1024 / 2) / 1024 + ') ');
        //this.crosshairElement.setAttribute('transform', 'scale(1024,1024) translate(' + (ev.x-1024/2)/1024 + ',' + (ev.y-1024/2)/1024 + ') ');
        //this.crosshairElement.setAttribute('transform', ' scale(1024,1024) translate(0.5 0) ');
        //this.crosshairElement.setAttribute('transform', 'scale(1024,512) ');
    };
    TargetCtrl.prototype.OnTouchEnd = function (ev) {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        ev.preventDefault();
        this.runZoomInAnimation_(this.zoomCenterPos, this.curZoom, 1);
    };
    TargetCtrl.prototype.TransformToUnzoomedNormalized = function (pos) {
        if (this.curZoom == 1 || this.zoomCenterPos == null) {
            return pos;
        }
        var posAbs = this.DeNormalize(pos);
        var diff = { dx: (posAbs.x - this.zoomCenterPos.x) * this.curZoom, dy: (posAbs.y - this.zoomCenterPos.y) * this.curZoom };
        //var zoomCenterNormalized=this.Normalize(this.zoomCenterPos)
        var pos2 = { x: this.zoomCenterPos.x + diff.dx, y: this.zoomCenterPos.y + diff.dy };
        var posNormalized = this.Normalize(pos2);
        return posNormalized;
    };
    TargetCtrl.prototype.Normalize = function (pos) {
        return { x: pos.x / this.canvasWidth, y: pos.y / this.canvasHeight };
    };
    TargetCtrl.prototype.DeNormalize = function (pos) {
        return { x: pos.x * this.canvasWidth, y: pos.y * this.canvasHeight };
    };
    TargetCtrl.prototype.runZoomInAnimation = function (ev, startZoom, endZoom) {
        this.runZoomInAnimation_(this.getMousePos(this.element, ev), startZoom, endZoom);
    };
    TargetCtrl.prototype.runZoomInAnimation_ = function (zoomCenter, startZoom, endZoom) {
        var _this = this;
        //var pos = this.getMousePos(this.element, ev);
        this.zoomCenterPos = zoomCenter; //this.getMousePos(this.element, ev);
        //this.setHitGraphicsTransform(pos.x, pos.y, endZoom);
        this.zoomAnimation = $({ xyz: startZoom });
        /*$({ xyz: startZoom })*/ this.zoomAnimation.animate({ xyz: endZoom }, {
            duration: 150,
            step: function (now, fx) {
                //console.log("anim now " + now);
                var ctx = _this.element.getContext("2d");
                _this.setTransform(ctx, _this.zoomCenterPos.x, _this.zoomCenterPos.y, now);
                ctx.drawImage(_this.backupElement, 0, 0, _this.canvasWidth, _this.canvasHeight);
                _this.setHitGraphicsTransform(_this.zoomCenterPos.x, _this.zoomCenterPos.y, now);
                _this.curZoom = now;
            },
            complete: function (now, fx) {
                var ctx = _this.element.getContext("2d");
                _this.drawZoomed(ctx, _this.zoomCenterPos.x, _this.zoomCenterPos.y, endZoom);
                _this.setHitGraphicsTransform(_this.zoomCenterPos.x, _this.zoomCenterPos.y, endZoom);
                _this.curZoom = endZoom;
                _this.zoomAnimation = null;
                if (_this.curZoom == 1) {
                    _this.zoomCenterPos = null;
                }
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
    return TargetCtrl;
}());
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