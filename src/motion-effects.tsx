// import { useEffect } from "react";
// import { IGridDrawingInfo } from "./types";

import { Component, createEffect, onCleanup } from "solid-js";
import { iObject } from "./types";
import * as Store from "./store";

export interface iMotionEffectsElementProps {
  object: iObject;
}

// todo this is a good prototype, but completely borked
// the particles dont self delete when they get to the bottom, and you cant have 2 motion effects running at the same time
export const Rain: Component<iMotionEffectsElementProps> = (props) => {
  var maxParts = 5;
  let particles: {
    x: number;
    y: number;
    l: number;
    xs: number;
    ys: number;
  }[] = [];

  const initParticles = (w: number, h: number) => {
    for (var a = 0; a < maxParts; a++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10,
      });
    }
  };

  function draw(
    context: CanvasRenderingContext2D,
    tempCanvas: HTMLCanvasElement,
    w: number,
    h: number,
  ) {
    context.clearRect(0, 0, w, h);
    context.drawImage(tempCanvas, 0, 0);
    for (var c = 0; c < particles.length; c++) {
      var p = particles[c];
      context.beginPath();
      context.moveTo(p.x, p.y);
      context.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      context.stroke();
    }
    move(w, h);
  }

  function move(w: number, h: number) {
    for (var b = 0; b < particles.length; b++) {
      var p = particles[b];
      p.x += p.xs;
      p.y += p.ys;
      if (p.x > w || p.y > h) {
        p.x = Math.random() * w;
        p.y = -20;
      }
    }
  }

  createEffect(() => {
    if (props.object.motionEffect !== "RAIN") {
      return;
    }
    const canvas = document.getElementById(
      `motion-effect-rain-${props.object.id}`,
    ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    var w = props.object.width;
    var h = props.object.height;
    // context.strokeStyle = "rgba(255,0,0,1)";
    context.strokeStyle = "rgba(174,194,224,0.5)";
    context.lineWidth = 5;
    context.lineCap = "round";

    initParticles(w, h);
    const interval = setInterval(() => {
      draw(context, canvas, w, h);
    }, 30);

    onCleanup(() => {
      console.log("clear interval");
      clearInterval(interval);
      particles = [];
    });
  });

  return (
    <canvas
      style={`
        width: ${props.object.width}px;
      height: ${props.object.height}px;
      transform:
        translate(${props.object.x}px,
          ${props.object.y}px)
        `}
      width={props.object.width}
      height={props.object.height}
      class="MOTION-EFFECTS-RAIN canvas-capture pointer-events-none absolute left-0 top-0 w-full"
      id={`motion-effect-rain-${props.object.id}`}
    ></canvas>
  );
};

// : {
//   isImageImported: boolean;
//   gridDrawingInfo: IGridDrawingInfo;
// }) => {
//   useEffect(() => {
//     if (!isImageImported) {
//       return;
//     }

//     const canvas = document.getElementById(
//       "canvas-3-motion-effect"
//     ) as HTMLCanvasElement;

//     if (!canvas) {
//       return;
//     }

//     const context = canvas.getContext("2d");
//     if (!context) {
//       return;
//     }
//     var w = canvas.width;
//     var h = canvas.height;
//     // context.strokeStyle = "rgba(255,0,0,1)";
//     context.strokeStyle = "rgba(174,194,224,0.5)";

//     context.lineWidth = 5;
//     context.lineCap = "round";

//     const canvas1 = document.getElementById(
//       "canvas-1-image"
//     ) as HTMLCanvasElement;
//     const canvas2 = document.getElementById(
//       "canvas-2-grid"
//     ) as HTMLCanvasElement;

//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = w;
//     tempCanvas.height = h;
//     const tempCanvasContext = tempCanvas.getContext("2d");
//     if (!tempCanvasContext) {
//       return;
//     }
//     tempCanvasContext.drawImage(canvas1, 0, 0);
//     tempCanvasContext.globalAlpha = gridDrawingInfo.opacity;
//     tempCanvasContext.drawImage(canvas2, 0, 0);
//     tempCanvasContext.globalAlpha = 1;

//     console.log("draw temp canvas");
//     initParticles(w, h);
//     const interval = setInterval(() => {
//       draw(context, tempCanvas, w, h);
//     }, 30);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [gridDrawingInfo, isImageImported]);
//   return (
//     <canvas
//       style={
//         {
//           // opacity: gridDrawingInfo.opacity,
//         }
//       }
//       width="1"
//       height="1"
//       className="w-full absolute top-0 left-0 canvas-capture"
//       id="canvas-3-motion-effect"
//     ></canvas>
//   );
// };
