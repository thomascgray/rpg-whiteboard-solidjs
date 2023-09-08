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
      .filter((o) => o.type === eObjectType.LINE_OF_SIGHT_WALL_ANCHOR)
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

    // compute the visibility polygon, this can be used to draw a polygon with Canvas or WebGL
    const visibility = compute(position, segments);

    context.beginPath();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.5;
    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // there will be more than 1 visibility polygon, based on
    // multiple characters, etc.

    const battleTokens = Store.objects.filter(
      (o) => o.type === eObjectType.IMAGE && o.isBattleToken === true,
    );
    let visibilitySets: Vector2D[][] = [];
    battleTokens.forEach((token) => {
      const tokenPosition: Vector2D = [token.x, token.y];
      const visibility = compute(tokenPosition, segments);
      visibilitySets.push(visibility);
    });

    visibilitySets.forEach((visibility) => {
      const [first, ...rest] = visibility;
      context.globalAlpha = 1;
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.moveTo(first[0] - props.object.x, first[1] - props.object.y);
      rest.forEach((vector) => {
        context.lineTo(vector[0] - props.object.x, vector[1] - props.object.y);
      });
      console.log("b");
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
