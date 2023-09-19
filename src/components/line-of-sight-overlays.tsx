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
import { isPointInsideBox, randomColour } from "../utils/general-utils";

export const DynamicLighting: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
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
      .filter((o) => isPointInsideBox(o, props.object))
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
    // let visibilitySets: Vector2D[][] = [];
    let tokensAndVisibilitys: {
      obj: iObject;
      visibility: Vector2D[];
    }[] = [];

    Store.objects
      .filter((o) => o.type === eObjectType.IMAGE && o.isBattleToken === true)
      .filter((o) => isPointInsideBox(o, props.object))
      .forEach((token) => {
        const visibility = compute(
          [token.x + token.width / 2, token.y + token.height / 2],
          breakIntersections(segys),
        );
        tokensAndVisibilitys.push({
          obj: token,
          visibility,
        });
      });

    // ...then "paint"/remove the visibility of each token

    if (!props.object.battlemap_isDynamicLightingDarkness) {
      tokensAndVisibilitys.forEach((x) => {
        const [first, ...rest] = x.visibility;
        context.globalAlpha = 1;
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.moveTo(first[0] - props.object.x, first[1] - props.object.y);
        rest.forEach((vector) => {
          context.lineTo(
            vector[0] - props.object.x,
            vector[1] - props.object.y,
          );
        });
        context.fill();
        context.closePath();
      });
    }

    // night time mode stuff

    // todo this has a bug where the lightsources are "going through walls"
    // see https://i.imgur.com/qRQHJEy.png
    // i THINK a fix might be to only draw the lightsources that are in the same
    // polygon as the token
    // thats only gone and bloody done it boys
    // wait, no, still fucked lmao
    // https://i.imgur.com/3JL9BGE.png

    if (props.object.battlemap_isDynamicLightingDarkness) {
      const nightTimeCanvas = document.createElement("canvas");
      nightTimeCanvas.width = canvasRef.width;
      nightTimeCanvas.height = canvasRef.height;

      const nightTimeCanvasContext = nightTimeCanvas.getContext("2d");
      if (!nightTimeCanvasContext) {
        return;
      }

      tokensAndVisibilitys.forEach((x) => {
        // const visibilityCanvas = document.createElement("canvas");
        // visibilityCanvas.width = canvasRef.width;
        // visibilityCanvas.height = canvasRef.height;

        // const visibilityContext = visibilityCanvas.getContext("2d");
        // if (!visibilityContext) {
        //   return;
        // }

        // use the visibility polygons to create a "shadow" for each token

        // use the visibility polygons to create a "master shadow"
        const [first, ...rest] = x.visibility;
        nightTimeCanvasContext.globalAlpha = 1;
        nightTimeCanvasContext.globalCompositeOperation = "source-over";
        // nightTimeCanvasContext.fillStyle = `#${randomColour()}`;
        nightTimeCanvasContext.fillStyle = `black`;
        nightTimeCanvasContext.beginPath();
        nightTimeCanvasContext.moveTo(
          first[0] - props.object.x,
          first[1] - props.object.y,
        );
        rest.forEach((vector) => {
          // @ts-ignore
          nightTimeCanvasContext.lineTo(
            vector[0] - props.object.x,
            vector[1] - props.object.y,
          );
        });
        nightTimeCanvasContext.fill();
        nightTimeCanvasContext.closePath();

        // now, for each visibility polygon, we need to make a shape that we can cut out of the master shadow layer
        // so that means that for each visibility polygon, we need to make a new canvas
        // and then we need to cut out the light sources from that canvas

        const xCanvas = document.createElement("canvas");
        xCanvas.width = canvasRef.width;
        xCanvas.height = canvasRef.height;
        const xContext = xCanvas.getContext("2d")!;
        xContext.globalAlpha = 1;
        xContext.globalCompositeOperation = "source-over";
        xContext.fillStyle = `#${randomColour()}`;
        // xContext.fillStyle = `red`;
        xContext.beginPath();
        xContext.moveTo(first[0] - props.object.x, first[1] - props.object.y);
        rest.forEach((vector) => {
          // @ts-ignore
          xContext.lineTo(
            vector[0] - props.object.x,
            vector[1] - props.object.y,
          );
        });
        xContext.fill();
        xContext.closePath();

        // "cut out" the light sources out of each visibility canvas individually
        xContext.globalCompositeOperation = "destination-out";
        xContext.globalAlpha = 1;
        const lightSourceTokens = [
          x.obj,
          ...Store.objects
            .filter(
              (o) =>
                (o.type === eObjectType.IMAGE && o.isBattleToken === true) ||
                o.type === eObjectType.LINE_OF_SIGHT_LIGHT_SOURCE,
            )
            .filter((o) => isPointInsideBox(o, props.object))
            .filter((o) => isPointInsideBox(o, x.obj)),
        ];
        lightSourceTokens.forEach((token) => {
          xContext.beginPath();
          xContext.arc(
            // we need the offest of the token from the canvas
            // here but not above, because this xContext is entirely in memory;
            // the real context has the same offset as the tokens already
            token.x + token.width / 2 - props.object.x,
            token.y + token.height / 2 - props.object.y,
            200,
            0,
            2 * Math.PI,
          );
          xContext.fill();
          xContext.closePath();
        });

        // and then cut the x canvas out of the master shadow canvas
        nightTimeCanvasContext.globalAlpha = 1;
        nightTimeCanvasContext.globalCompositeOperation = "destination-out";
        nightTimeCanvasContext.drawImage(xCanvas, 0, 0);

        // now combine all the visibility "shadows" into a single one on the nighttime canvas
        // nightTimeCanvasContext.globalAlpha = 1;
        // nightTimeCanvasContext.globalCompositeOperation = "source-over";
        // nightTimeCanvasContext.drawImage(visibilityCanvas, 0, 0);
      });

      // and now add the night time canvas over the main canvas
      context.globalAlpha = 1;
      context.globalCompositeOperation = "destination-out";
      context.drawImage(nightTimeCanvas, 0, 0);
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
