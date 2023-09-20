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

    if (!props.object.battlemap_isDynamicLightingDarkness) {
      // ...then calculate the visibility of each token
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

    // ok actually i was wrong - what we want is for players to be able to see the intersection of
    // their base visibility and the light source
    // see: https://i.imgur.com/cbOv4xa.png

    if (props.object.battlemap_isDynamicLightingDarkness) {
      const nightTimeCanvas = document.createElement("canvas");
      nightTimeCanvas.width = canvasRef.width;
      nightTimeCanvas.height = canvasRef.height;

      const nightTimeCanvasContext = nightTimeCanvas.getContext("2d");
      if (!nightTimeCanvasContext) {
        return;
      }

      const tokensWithVisibility = Store.objects
        .filter((o) => o.type === eObjectType.IMAGE && o.isBattleToken === true)
        .filter((o) => isPointInsideBox(o, props.object))
        .map((lineOfSightToken) => {
          const visibility = compute(
            [
              lineOfSightToken.x + lineOfSightToken.width / 2,
              lineOfSightToken.y + lineOfSightToken.height / 2,
            ],
            breakIntersections(segys),
          );
          const circle = generateCirclePolygon(
            [
              lineOfSightToken.x + lineOfSightToken.width / 2,
              lineOfSightToken.y + lineOfSightToken.height / 2,
            ],
            100,
            20,
          );
          const actualVisibility = polyclip.intersection(
            [visibility],
            [circle],
          ) as Geom;

          return {
            obj: lineOfSightToken,
            visibility: polyclip.union([visibility]),
            visibilityWithRange: actualVisibility,
          };
        });

      const lightSourcesWithVisibility = Store.objects
        .filter((o) => o.type === eObjectType.LINE_OF_SIGHT_LIGHT_SOURCE)
        .filter((o) => isPointInsideBox(o, props.object))
        .map((lineOfSightToken) => {
          const visibility = compute(
            [
              lineOfSightToken.x + lineOfSightToken.width / 2,
              lineOfSightToken.y + lineOfSightToken.height / 2,
            ],
            breakIntersections(segys),
          );
          const circle = generateCirclePolygon(
            [
              lineOfSightToken.x + lineOfSightToken.width / 2,
              lineOfSightToken.y + lineOfSightToken.height / 2,
            ],
            100,
            20,
          );
          const actualVisibility = polyclip.intersection(
            [visibility],
            [circle],
          ) as Geom;

          return {
            obj: lineOfSightToken,
            visibility: actualVisibility,
          };
        });

      nightTimeCanvasContext.globalAlpha = 1;
      nightTimeCanvasContext.globalCompositeOperation = "source-over";
      nightTimeCanvasContext.fillStyle = `black`;
      nightTimeCanvasContext.beginPath();

      const lightSourceVisibilityPolygons = lightSourcesWithVisibility.map(
        (x) => x.visibility,
      );

      const lightSourceUnionSet = polyclip.union(
        // @ts-ignore
        ...lightSourceVisibilityPolygons,
      );

      const tokenVisibilities = tokensWithVisibility.map((x) => x.visibility);
      const tokenVisibilitiesWithRange = tokensWithVisibility.map(
        (x) => x.visibilityWithRange,
      );

      // @ts-ignore
      const tokenVisibilityUnionSet = polyclip.union(...tokenVisibilities);

      const tokenVisibilityWithRangeUnionSet = polyclip.union(
        // @ts-ignore
        ...tokenVisibilitiesWithRange,
      );

      const intersectionOfTokensAndLightSources = polyclip.intersection(
        // @ts-ignore
        tokenVisibilityUnionSet,
        lightSourceUnionSet,
      );

      const megaUnionSet = polyclip.union(
        // @ts-ignore
        tokenVisibilityWithRangeUnionSet,
        intersectionOfTokensAndLightSources,
      );

      megaUnionSet.forEach((multiPolygon) => {
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
      context.globalCompositeOperation = "destination-out";
      context.drawImage(nightTimeCanvas, 0, 0);
    }
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
