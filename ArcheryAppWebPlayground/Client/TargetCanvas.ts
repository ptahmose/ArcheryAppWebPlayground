

"use strict";


//$(document).ready(function () {
//    console.log("ready!");
//});
/*
    class TargetControl {
        constructor(public canvasName: string) {
            this.canvasName = canvasName;
           // const $p: JQuery = $("version");
            $("button.continue").html("Next Step...")
        }
    }

*/

function testTarget(id: string) {
    var c = <HTMLCanvasElement>($("#"+id)[0]);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke(); 
}