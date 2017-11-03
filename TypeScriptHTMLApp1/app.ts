declare var $: any;

//import $ from 'jquery'
//import $ = require("jquery");

class Greeter {
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

}

class TargetSegment {
    segmentColor: ColorUtils.RGB;
    marginColor: ColorUtils.RGB;
    constructor(readonly radius: number, readonly marginWidth: number, readonly text: string, segmentColor: ColorUtils.RGB, marginColor: ColorUtils.RGB, textColor: ColorUtils.RGB) {
        this.segmentColor = segmentColor;
        this.marginColor = marginColor;
    }
}

class CanvasInfo {
    constructor(readonly width: number, readonly height: number)
    { }

    get centerX(): number { return this.width / 2; }
    get centerY(): number { return this.height / 2; }
    get radiusX(): number { return this.width / 2; }
    get radiusY(): number { return this.height / 2; }
}

class TargetCtrl {
    element: HTMLCanvasElement;
    canvasWidth: number;
    canvasHeight: number;

    backupElement: HTMLCanvasElement;

    static WhiteSegment = new ColorUtils.RGB(226, 216, 217);
    static BlackSegment = new ColorUtils.RGB(54, 49, 53);
    static BlueSegment = new ColorUtils.RGB(68, 173, 228);
    static RedSegment = new ColorUtils.RGB(231, 37, 35);
    static RedSegmentText = new ColorUtils.RGB(176, 127, 113);
    static GoldSegment = new ColorUtils.RGB(251, 209, 3);
    static GoldSegmentText = new ColorUtils.RGB(165, 135, 11);
    static WhiteSegmentText = new ColorUtils.RGB(111, 106, 103);
    static BlackSegmentText = new ColorUtils.RGB(181, 177, 174);
    static BlueSegmentText = new ColorUtils.RGB(0, 56, 85);
    static Black = new ColorUtils.RGB(0, 0, 0);
    static White = new ColorUtils.RGB(255, 255, 255);

    constructor(element: HTMLCanvasElement) {
        this.curZoom = 1;

        this.element = element;
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
    }

    setupEvents(): void {
        this.element.onmousedown = (ev: MouseEvent) => { this.OnMouseDown(ev); };
        this.element.onmouseup = (ev: MouseEvent) => { this.OnMouseUp(ev); }
    }

    setTransform(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, zoom: number): void {
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
    }

    getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number } {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    private curZoom: number;
    private zoomAnimation:any;

    OnMouseDown(ev: MouseEvent): void {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }
        this.runZoomInAnimation(ev, this.curZoom, 0.1);
    }

    OnMouseUp(ev: MouseEvent): void {
        if (this.zoomAnimation != null) {
            this.zoomAnimation.stop();
        }

        this.runZoomInAnimation(ev,this.curZoom,1);
    }

    private runZoomInAnimation(ev: MouseEvent, startZoom: number, endZoom: number): void {
        var pos = this.getMousePos(this.element, ev);
        this.zoomAnimation = $({ xyz: startZoom });
        /*$({ xyz: startZoom })*/this.zoomAnimation.animate(
            { xyz: endZoom },
            {
                duration: 350,
                step: (now, fx) => {
                    //console.log("anim now " + now);
                    var ctx = this.element.getContext("2d");
                    this.setTransform(ctx, pos.x, pos.y, now);
                    ctx.drawImage(this.backupElement, 0, 0, this.canvasWidth, this.canvasHeight);
                    this.curZoom = now;
                },
                complete: (now, fx) => {
                    var ctx = this.element.getContext("2d");
                    this.drawZoomed(ctx, pos.x, pos.y, endZoom);
                    this.curZoom = endZoom;
                    this.zoomAnimation = null;
                }
            });
    }

    drawZoomed(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, zoom: number): void {
        var xDiff = centerX / zoom - centerX;
        var yDiff = centerY / zoom - centerY;
        ctx.setTransform(this.canvasWidth / zoom, 0, 0, this.canvasHeight / zoom, -xDiff, -yDiff);
        this.paintTarget(ctx);
    }

    UpdateCanvasWidthHeight(): void {
        this.canvasWidth = this.element.width;
        this.canvasHeight = this.element.height;
    }

    static getTargetSegments(): TargetSegment[] {
        const defaultMarginWidth: number = 0.01 / 2;
        return [
            new TargetSegment(1.0,
                defaultMarginWidth,
                "1",
                TargetCtrl.WhiteSegment,        /* Segment color */
                TargetCtrl.Black,               /* Margin color */
                TargetCtrl.WhiteSegmentText),   /* Text color */
            new TargetSegment(0.9,
                defaultMarginWidth,
                "2",
                TargetCtrl.WhiteSegment,
                TargetCtrl.Black,
                TargetCtrl.WhiteSegmentText),
            new TargetSegment(0.8,
                defaultMarginWidth,
                "3",
                TargetCtrl.BlackSegment,
                TargetCtrl.White,
                TargetCtrl.BlackSegmentText),
            new TargetSegment(0.7,
                defaultMarginWidth,
                "4",
                TargetCtrl.BlackSegment,
                TargetCtrl.White,
                TargetCtrl.BlackSegmentText),
            new TargetSegment(0.6,
                defaultMarginWidth,
                "5",
                TargetCtrl.BlueSegment,
                TargetCtrl.Black,
                TargetCtrl.BlueSegmentText),
            new TargetSegment(0.5,
                defaultMarginWidth,
                "6",
                TargetCtrl.BlueSegment,
                TargetCtrl.Black,
                TargetCtrl.BlueSegmentText),
            new TargetSegment(0.4,
                defaultMarginWidth,
                "7",
                TargetCtrl.RedSegment,
                TargetCtrl.Black,
                TargetCtrl.RedSegmentText),
            new TargetSegment(0.3,
                defaultMarginWidth,
                "8",
                TargetCtrl.RedSegment,
                TargetCtrl.Black,
                TargetCtrl.RedSegmentText),
            new TargetSegment(0.2,
                defaultMarginWidth,
                "9",
                TargetCtrl.GoldSegment,
                TargetCtrl.Black,
                TargetCtrl.GoldSegmentText),
            new TargetSegment(0.1,
                defaultMarginWidth,
                "10",
                TargetCtrl.GoldSegment,
                TargetCtrl.Black,
                TargetCtrl.GoldSegmentText)
        ];
    }

    paintTarget(ctx: CanvasRenderingContext2D): void {
        var canvasInfo = new CanvasInfo(1, 1);

        var targetSegments = TargetCtrl.getTargetSegments();

        for (var i = 0; i < targetSegments.length; ++i) {
            var s = targetSegments[i];
            var segmentEndRadius: number;
            if (i < targetSegments.length - 1) {
                segmentEndRadius = targetSegments[i + 1].radius;
            } else {
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
    }

    paintSegment(ctx: CanvasRenderingContext2D, startRadius: number, endRadius: number, centerX: number, centerY: number): void {
        var middle = (endRadius + startRadius) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, middle, 0, Math.PI * 2);
        ctx.lineWidth = (endRadius - startRadius) / 2;
        ctx.stroke();
    }

    paintSegmentTs(ctx: CanvasRenderingContext2D, canvasInfo: CanvasInfo, startRadius: number, endRadius: number, color: ColorUtils.RGB): void {
        ctx.beginPath();
        var startRadiusPx = startRadius * canvasInfo.radiusX;
        var endRadiusPx = endRadius * canvasInfo.radiusX;
        var middlePx = (startRadiusPx + endRadiusPx) / 2;
        ctx.arc(canvasInfo.centerX, canvasInfo.centerY, middlePx, 0, 2 * Math.PI);
        ctx.lineWidth = -endRadiusPx + startRadiusPx;
        ctx.strokeStyle = ColorUtils.ColorHelper.rgbToHex(color);
        ctx.stroke();
    }
}

window.onload = () => {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();
    var el = <HTMLCanvasElement>document.getElementById('myCanvas');

    //var el2 = <HTMLCanvasElement>document.getElementById('myCanvas2');

    var greeter = new TargetCtrl(el);
};