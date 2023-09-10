import { Component, createEffect } from "solid-js";
import { eObjectType, iObject, iPoint } from "../types";
import * as Store from "../store";
import {
  breakIntersections,
  convertToSegments,
  compute,
  computeViewport,
  inPolygon,
  // Position,
  Polygon,
  Vector2D,
  Segments,
} from "visibility-polygon";

export const DynamicLighting: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
    console.log("rebuilding dynamic light");
    const context = canvasRef.getContext("2d") as CanvasRenderingContext2D;
    if (!context) {
      return;
    }

    // todo we should always add the 4 corners of the canvas
    // so that the line segments don't generate "forever"

    // todo we need to convert the x and y of the objects into
    // canvas-relative coordinates
    const segys: Segments = [];
    Store.objects
      .filter((o) => o.type === eObjectType.LINE_OF_SIGHT_WALL)
      .forEach((o) => {
        segys.push([
          [o.x, o.y],
          [o.wallEndPoint!.x, o.wallEndPoint!.y],
        ]);
      });

    // paint the canvas entirely black...
    context.beginPath();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.5;
    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // ...then calculate the visibility of each token
    let visibilitySets: Vector2D[][] = [];
    Store.objects
      .filter((o) => o.type === eObjectType.IMAGE && o.isBattleToken === true)
      .forEach((token) => {
        const visibility = compute(
          [token.x, token.y],
          breakIntersections(segys),
        );
        visibilitySets.push(visibility);
      });

    // ...then "paint"/remove the visibility of each token
    visibilitySets.forEach((visibility) => {
      const [first, ...rest] = visibility;
      context.globalAlpha = 1;
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.moveTo(first[0] - props.object.x, first[1] - props.object.y);
      rest.forEach((vector) => {
        context.lineTo(vector[0] - props.object.x, vector[1] - props.object.y);
      });
      context.fill();
      context.closePath();
    });
  });

  return (
    <canvas
      style={`
      width: ${props.object.width}px;
      height: ${props.object.height}px;
      z-index: ${props.object.zIndex + 1};
      transform:
        translate(
          ${props.object.x}px,
          ${props.object.y}px)
      `}
      ref={canvasRef}
      width={props.object.width}
      height={props.object.height}
      class="dynamic-lighting pointer-events-none absolute left-0 top-0 w-full"
    ></canvas>
  );
};
