import { Component, createEffect, onCleanup, createSignal } from "solid-js";
import { iObject } from "../types";
import * as Store from "../store";

export interface iMotionEffectsElementProps {
  object: iObject;
}

interface iParticle {
  x: number;
  y: number;
  l: number;
  xs: number;
  ys: number;
}

// todo this is a good prototype, but completely borked
// the particles dont self delete when they get to the bottom, and you cant have 2 motion effects running at the same time
export const Rain: Component<iMotionEffectsElementProps> = (props) => {
  var maxParts = 30;
  let canvasRef: any;
  const [particles, setParticles] = createSignal<iParticle[]>([]);

  const initParticles = () => {
    let p = [];
    for (var a = 0; a < maxParts; a++) {
      p.push({
        x: Math.random() * props.object.width,
        y: Math.random() * props.object.height,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 50 + 10,
      });
    }
    setParticles(p);
  };

  function move(w: number, h: number, particles: iParticle[]) {
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

  function draw(
    context: CanvasRenderingContext2D,
    w: number,
    h: number,
    particles: iParticle[],
  ) {
    context.clearRect(0, 0, w, h);
    context.drawImage(canvasRef, 0, 0);
    for (var c = 0; c < particles.length; c++) {
      var p = particles[c];
      context.beginPath();
      context.globalAlpha = 0.2;
      context.moveTo(p.x, p.y);
      context.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      context.stroke();
    }
    move(w, h, particles);
  }

  createEffect(() => {
    if (props.object.motionEffect !== "RAIN") {
      return;
    }

    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    var w = props.object.width;
    var h = props.object.height;

    context.strokeStyle = "rgba(174,194,224,0.5)";
    context.lineWidth = 5;
    context.lineCap = "round";

    initParticles();
    const interval = setInterval(() => {
      draw(context, w, h, particles());
    }, 30);

    onCleanup(() => {
      console.log("clear interval");
      clearInterval(interval);
      setParticles([]);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style={`
        width: ${props.object.width}px;
        height: ${props.object.height}px;
        z-index: ${props.object.zIndex + 2};
        transform:
          translate(
            ${props.object.x}px,
            ${props.object.y}px)
        `}
      width={props.object.width}
      height={props.object.height}
      class="MOTION-EFFECTS-RAIN canvas-capture pointer-events-none absolute left-0 top-0"
      id={`motion-effect-rain-${props.object.id}`}
    ></canvas>
  );
};
