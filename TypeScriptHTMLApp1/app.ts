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

    constructor(element: HTMLCanvasElement) {
        this.element = element;

        var ctx = this.element.getContext("2d");
        this.paintTarget(ctx);
        //ctx.beginPath();
        //ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        //ctx.stroke();
    }

    static getTargetSegments(): TargetSegment[] {
        const DefaultMarginWidth = 0.01 / 2;
        return [
            new TargetSegment(1.0,
                DefaultMarginWidth,
                "1",
                new ColorUtils.RGB(226, 216, 217),
                new ColorUtils.RGB(0, 0, 0),
                new ColorUtils.RGB(0, 0, 0)),
            new TargetSegment(0.9,
                DefaultMarginWidth,
                "2",
                new ColorUtils.RGB(226, 216, 217),
                new ColorUtils.RGB(0, 0, 0),
                new ColorUtils.RGB(0, 0, 0)),
            new TargetSegment(0.8,
                DefaultMarginWidth,
                "3",
                new ColorUtils.RGB(54, 49, 53),
                new ColorUtils.RGB(255, 255, 255),
                new ColorUtils.RGB(0, 0, 0)),

            new TargetSegment(0.7,
                DefaultMarginWidth,
                "4",
                new ColorUtils.RGB(54, 49, 53),
                new ColorUtils.RGB(255, 255, 255),
                new ColorUtils.RGB(0, 0, 0))
        ];
    }

    paintTarget(ctx: CanvasRenderingContext2D): void {
        //ctx.beginPath();
        ////ctx.moveTo(100, 100);
        //ctx.arc(100, 100, 100, 0, Math.PI * 2);
        //ctx.lineWidth = 20;
        //ctx.stroke();


        //this.paintSegment(ctx, 60, 100, 100, 100);
        var canvasInfo = new CanvasInfo(100, 100);

        var targetSegments = TargetCtrl.getTargetSegments();

        targetSegments.forEach(s => {
            this.paintSegmentTs(ctx, canvasInfo, s.radius, s.radius - s.marginWidth, s.marginColor);
            this.paintSegmentTs(ctx, canvasInfo, s.radius - s.marginWidth, s.radius-0.1, s.segmentColor);
        });


        //        this.paintSegmentTs(ctx, canvasInfo, 0.5, 0.6, ColorUtils.ColorHelper.hexToRgb('#f00000'));
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
    var greeter = new TargetCtrl(el);
};