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

    // TODO i think all the positions in here need to acount for
    // the offset between the items themselves, and the canvas

    // our segments basically are out wall objects
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
          [token.x + token.width / 2, token.y + token.height / 2],
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

    // night time mode stuff

    // todo this has a bug where the lightsources are "going through walls"
    // see https://i.imgur.com/qRQHJEy.png
    // i THINK a fix might be to only draw the lightsources that are in the same
    // polygon as the token
    // thats only gone and bloody done it boys
    // wait, no, still fucked lmao
    // https://i.imgur.com/3JL9BGE.png

    if (props.object.battlemap_isDynamicLightingDarkness) {
      visibilitySets.forEach((visibilityPolygon) => {
        const visibilityCanvas = document.createElement("canvas");
        visibilityCanvas.width = canvasRef.width;
        visibilityCanvas.height = canvasRef.height;

        const visibilityContext = visibilityCanvas.getContext("2d");
        if (!visibilityContext) {
          return;
        }

        // draw the shadows
        const [first, ...rest] = visibilityPolygon;
        visibilityContext.globalAlpha = 0.5;
        visibilityContext.globalCompositeOperation = "source-over";
        visibilityContext.fillStyle = "black";
        visibilityContext.beginPath();
        visibilityContext.moveTo(
          first[0] - props.object.x,
          first[1] - props.object.y,
        );
        rest.forEach((vector) => {
          // @ts-ignore
          visibilityContext.lineTo(
            vector[0] - props.object.x,
            vector[1] - props.object.y,
          );
        });
        visibilityContext.fill();
        visibilityContext.closePath();

        // "cut out" the light sources
        visibilityContext.globalCompositeOperation = "destination-out";
        visibilityContext.globalAlpha = 1;

        Store.objects
          .filter(
            (o) =>
              (o.type === eObjectType.IMAGE && o.isBattleToken === true) ||
              (o.type === eObjectType.LINE_OF_SIGHT_LIGHT_SOURCE &&
                inPolygon([o.x, o.y], visibilityPolygon)),
          )
          .forEach((token) => {
            visibilityContext.beginPath();
            visibilityContext.arc(
              // we need the offest of the token from the canvas
              // here but not above, because this visibilityContext is entirely in memory;
              // the real context has the same offset as the tokens already
              token.x + token.width / 2 - props.object.x,
              token.y + token.height / 2 - props.object.y,
              200,
              0,
              2 * Math.PI,
            );
            visibilityContext.fill();
            visibilityContext.closePath();
          });

        context.globalCompositeOperation = "source-over";
        context.drawImage(visibilityCanvas, 0, 0);
      });
    }
    // if we're in nighttime mode, we need to
    // - Work out the original visibility polygon
    // - Then we make an all black version of THAT polygon
    // - We cut the light source circles out of THAT polygon
    // - And we then overlay that on top of the area of the original visibility polygon
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
