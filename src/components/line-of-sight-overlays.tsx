import { Component, createEffect } from "solid-js";
import { eObjectType, iObject, iPoint } from "../types";
import * as Store from "../store";
import * as _ from "lodash";
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
import {
  generateCirclePolygon,
  isPointInsideBox,
  randomColour,
} from "../utils/general-utils";
import * as polyclip from "polyclip-ts";
import { Geom } from "polyclip-ts/types/geom-in";

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

      const radius = 100; // in meters

      const shapes = tokensAndVisibilitys.map((x) => {
        const circle = generateCirclePolygon(
          [x.obj.x + x.obj.width / 2, x.obj.y + x.obj.height / 2],
          radius,
          32,
        );

        return polyclip.union([x.visibility], [circle]);
      });

      console.log("shapes", shapes);

      // const totalLight = polyclip.union([...shapes])

      // const circles = tokensAndVisibilitys.map((x) => {
      //   const coordinates = [
      //     x.obj.x + x.obj.width / 2,
      //     x.obj.y + x.obj.height / 2,
      //   ];
      //   return [generateCirclePolygon(coordinates, radius, 32)];
      // });

      // const unionSet = polyclip.union([
      //   ...tokensAndVisibilitys.map((x) => [x.visibility]),
      // ]) as Geom;

      // const unionSetWithShadowsCutOut = polyclip.intersection(
      //   unionSet,
      //   circles,
      // );

      nightTimeCanvasContext.globalAlpha = 1;
      nightTimeCanvasContext.globalCompositeOperation = "source-over";
      nightTimeCanvasContext.fillStyle = `black`;
      nightTimeCanvasContext.beginPath();

      shapes.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const [firstPoint, ...restPoints] = polygon!;

          nightTimeCanvasContext.moveTo(
            // @ts-ignore
            firstPoint[0] - props.object.x,
            // @ts-ignore
            firstPoint[1] - props.object.y,
          );
          restPoints.forEach((point) => {
            nightTimeCanvasContext.lineTo(
              // @ts-ignore
              point[0] - props.object.x,
              // @ts-ignore
              point[1] - props.object.y,
            );
          });
        });
      });

      nightTimeCanvasContext.fill();
      nightTimeCanvasContext.closePath();

      // and now add the night time canvas over the main canvas
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
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
