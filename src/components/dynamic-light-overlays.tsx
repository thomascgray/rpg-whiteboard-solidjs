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

function pointsToLineSegments(points: iPoint[]): Segments {
  if (points.length < 2) {
    // Not enough points to create line segments
    return [];
  }

  const lineSegments: Segments = [];

  for (let i = 0; i < points.length; i++) {
    const startPoint = points[i];
    const endPoint = points[(i + 1) % points.length]; // Wrap around to the first point
    lineSegments.push([
      [startPoint.x, startPoint.y],
      [endPoint.x, endPoint.y],
    ]);
  }

  return lineSegments;
}

export const DynamicLighting: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
    const context = canvasRef.getContext("2d") as CanvasRenderingContext2D;
    if (!context) {
      return;
    }

    const lineOfSightWallPoints = Store.objects
      .filter((o) => o.type === eObjectType.LINE_OF_SIGHT_WALL_POINT)
      .map((o) => {
        return {
          x: o.x,
          y: o.y,
        };
      });

    // todo we should always add the 4 corners of the canvas
    // so that the line segments don't generate "forever"

    // todo we need to convert the x and y of the objects into
    // canvas-relative coordinates
    const segys = pointsToLineSegments(lineOfSightWallPoints);

    const segments = breakIntersections(segys);

    // define your position in which the visibility should be calculated from
    const position: Vector2D = [
      Store.leftMouseDownPosCanvas().x,
      Store.leftMouseDownPosCanvas().y,
    ];

    console.log("segys", segys);
    console.log("position", position);

    // compute the visibility polygon, this can be used to draw a polygon with Canvas or WebGL
    const visibility = compute(position, segments);

    // this is my mad bullshit from old project - use this?
    // const xRatio = width / originalWidth;
    // const yRatio = height / originalHeight;
    // const x = (e.clientX - rect.left) / xRatio / cameraZ;
    // const y = (e.clientY - rect.top) / yRatio / cameraZ;

    if (lineOfSightWallPoints.length > 2) {
      const [first, ...rest] = lineOfSightWallPoints;

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.beginPath();
      context.moveTo(first.x, first.y);
      rest.forEach((vector) => {
        context.lineTo(vector.x - props.object.x, vector.y - props.object.y);
      });
      console.log("a");
      context.fillStyle = "black";
      context.fill();
      context.closePath();
    }

    // context.beginPath();
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // context.globalCompositeOperation = "source-over";
    // context.globalAlpha = 0.5;
    // context.fillStyle = "black";
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // context.globalAlpha = 1;
    // context.globalCompositeOperation = "destination-out";
    // context.beginPath();
    // context.moveTo(first[0], first[1]);
    // rest.forEach((vector) => {
    //   context.lineTo(vector[0], vector[1]);
    // });
    // console.log("a");
    // context.fill();
    // context.closePath();
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
