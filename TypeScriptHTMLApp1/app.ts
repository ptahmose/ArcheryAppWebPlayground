declare var $: any;

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
        this.element = element;
        this.setupEvents();
        this.UpdateCanvasWidthHeight();
        var ctx = this.element.getContext("2d");


        ctx.setTransform(this.canvasWidth, 0, 0, this.canvasHeight, 0, 0);
        this.paintTarget(ctx);
        ctx.setTransform(1,0,0,1,0,0);

        this.backupElement = document.createElement("canvas");
        this.backupElement.width = this.canvasWidth;
        this.backupElement.height = this.canvasHeight;
        var ctxBackup = this.backupElement.getContext("2d");
        ctxBackup.drawImage(this.element, 0, 0, this.canvasWidth, this.canvasHeight);


        //var el2 = <HTMLCanvasElement>document.getElementById('myCanvas2');
        //var ctx2 = el2.getContext("2d");
        //ctx2.drawImage(this.backupElement, 0, 0, this.canvasWidth, this.canvasHeight);


        /*
        this.backupElement = document.createElement("canvas");
        this.backupElement.width = this.canvasWidth;
        this.backupElement.height = this.canvasHeight;
        var ctxBackup = this.backupElement.getContext("2d");
        ctxBackup.drawImage(this.element, 0, 0, this.canvasWidth, this.canvasHeight);


        var memCanvas = document.createElement("canvas");
        memCanvas.width = this.canvasWidth;
        memCanvas.height = this.canvasHeight;
        var ctxMemCanvas = memCanvas.getContext("2d");
        ctxMemCanvas.setTransform(this.canvasWidth, 0, 0, this.canvasHeight, 0, 0);
        this.paintTarget(ctxMemCanvas);

        //ctx.drawImage(memCanvas, 0, 0, this.canvasWidth, this.canvasHeight);
        ctx.drawImage(memCanvas,this.canvasWidth / 4, this.canvasHeight / 4, this.canvasWidth / 2, this.canvasHeight / 2, 0, 0, this.canvasWidth, this.canvasHeight);
        this.backupElement = memCanvas;
        */
        /*ctx.setTransform(this.canvasWidth, 0, 0, this.canvasHeight, 0, 0);
        this.paintTarget(ctx);*/

        //ctx.beginPath();
        //ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        //ctx.stroke();
    }

    setupEvents(): void {
        //this.element.onmousedown((ev: MouseEvent) =>  this.OnMouseDown(ev) );
        this.element.onmousedown = (ev: MouseEvent) => { this.OnMouseDown(ev); };
    }

    OnMouseDown(ev: MouseEvent): void {

        $({ xyz: 1 }).animate({ xyz: 0.1 }, { duration:5000,step:(now,fx)=> {
            console.log("anim now " + now);
            var ctx = this.element.getContext("2d");
            var w = this.canvasWidth * now;
            var h = this.canvasHeight * now;
            ctx.drawImage(this.backupElement, (this.canvasWidth -w)/2, (this.canvasHeight-h) / 2, w, h, 0, 0, this.canvasWidth, this.canvasHeight);
        }});

/*
        var ctx = this.element.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.drawImage(this.backupElement, this.canvasWidth / 4, this.canvasHeight / 4, this.canvasWidth / 2, this.canvasHeight / 2, 0, 0, this.canvasWidth, this.canvasHeight);

        var el2 = <HTMLCanvasElement>document.getElementById('myCanvas2');
        var ctx2 = el2.getContext("2d");
        //ctx2.drawImage(this.backupElement, 0, 0, this.canvasWidth, this.canvasHeight);
        ctx2.drawImage(this.backupElement, this.canvasWidth / 4, this.canvasHeight / 4, this.canvasWidth / 2, this.canvasHeight / 2, 0, 0, this.canvasWidth, this.canvasHeight);
*/

/*






        var ctx = this.element.getContext("2d");
        ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        //var ctxBackup = this.backupElement.getContext("2d");
        //ctx.drawImage(this.backupElement, this.canvasWidth/4,this.canvasHeight/4,this.canvasWidth/2,this.canvasHeight/2,0,0,this.canvasWidth,this.canvasHeight);
        ctx.drawImage(this.backupElement, 0, 0, this.canvasWidth, this.canvasHeight);
        //ctx.setTransform(this.canvasWidth * 2, 0, 0, this.canvasHeight * 2, -this.canvasWidth / 2, -this.canvasHeight / 2);
        //this.paintTarget(ctx);
*/
        return;
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
        //ctx.beginPath();
        ////ctx.moveTo(100, 100);
        //ctx.arc(100, 100, 100, 0, Math.PI * 2);
        //ctx.lineWidth = 20;
        //ctx.stroke();


        //this.paintSegment(ctx, 60, 100, 100, 100);
        //var canvasInfo = new CanvasInfo(this.canvasWidth, this.canvasHeight);

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