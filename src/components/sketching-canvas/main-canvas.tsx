import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../../store";
import { eMouseButton, eObjectType, eTool } from "../../types";
import * as Config from "../../config";

// @ts-ignore
import C2S from "canvas2svg";
import svgToTinyDataUri from "mini-svg-data-uri";
import { screenToCanvas } from "../../utils/general-utils";
import { nanoid } from "nanoid";

// todo something in here is causing console errors?
export const MainCanvas: Component = (props) => {
  return (
    <canvas
      id={Config.APP_CANVAS_DOM_ID}
      class="absolute left-0 top-0 h-full w-full"
      width={window.innerWidth}
      height={window.innerHeight}
      classList={{
        "pointer-events-none": Store.selectedTool() !== eTool.SKETCH,
      }}
      onMouseDown={(e) => {
        if (e.button !== eMouseButton.LEFT) {
          return;
        }
        Store.unselectObjects();
        window.__canvasContext!.globalCompositeOperation = "source-over";

        // [1] the points start just where we click...
        window.__canvasDrawingTopLeftPoint = {
          x: e.pageX,
          y: e.pageY,
        };
        window.__canvasDrawingBottomRightPoint = {
          x: e.pageX,
          y: e.pageY,
        };
        window.__canvasContext!.globalCompositeOperation = "source-over";
        window.__canvasContext!.beginPath();
        window.__canvasContext!.strokeStyle = Store.penColour();
        window.__canvasContext!.lineJoin = "round";
        window.__canvasContext!.fillStyle = Store.penColour();
        window.__canvasContext!.lineWidth = Store.penSize();
        window.__canvasContext!.lineCap = "round";
        window.__canvasContext!.moveTo(e.pageX, e.pageY);
        window.__canvasContext!.arc(
          e.pageX,
          e.pageY,
          Store.penSize() / 2,
          0,
          2 * Math.PI,
        );
        window.__canvasContext!.fill();
        window.__canvasContext!.closePath();
        window.__canvasContext!.beginPath();
      }}
      onMouseMove={(e) => {
        if (!Store.heldMouseButtons().includes(eMouseButton.LEFT)) {
          return;
        }

        window.__canvasContext!.lineTo(e.pageX, e.pageY);
        window.__canvasContext!.stroke();

        // [1]...and as we move, we update the top left and bottom right points
        // so we can draw a rectangle around the drawing
        // e.g if any point is further up or left than the top left, that becomes
        // the new top left
        // if any point is further down or right than the bottom right, that becomes
        // the new bottom right
        if (e.pageX < window.__canvasDrawingTopLeftPoint!.x) {
          window.__canvasDrawingTopLeftPoint!.x = e.pageX;
        }
        if (e.pageY < window.__canvasDrawingTopLeftPoint!.y) {
          window.__canvasDrawingTopLeftPoint!.y = e.pageY;
        }
        if (e.pageX > window.__canvasDrawingBottomRightPoint!.x) {
          window.__canvasDrawingBottomRightPoint!.x = e.pageX;
        }
        if (e.pageY > window.__canvasDrawingBottomRightPoint!.y) {
          window.__canvasDrawingBottomRightPoint!.y = e.pageY;
        }
      }}
      onMouseUp={(e) => {
        if (e.button !== eMouseButton.LEFT) {
          return;
        }
        const xDiff =
          window.__canvasDrawingBottomRightPoint!.x -
          window.__canvasDrawingTopLeftPoint!.x;
        const yDiff =
          window.__canvasDrawingBottomRightPoint!.y -
          window.__canvasDrawingTopLeftPoint!.y;

        const width = (xDiff < 1 ? 1 : xDiff) + Store.penSize();
        const height = (yDiff < 1 ? 1 : yDiff) + Store.penSize();

        window.__canvasSvgContext = new C2S(width, height);

        // doing draw image results in blurry svg, maybe we DO need to mirror the inputs
        // against both contexts, hmm, more math required
        window.__canvasSvgContext.drawImage(
          window.__canvasDom,
          window.__canvasDrawingTopLeftPoint!.x - Store.penSize() / 2, // source x
          window.__canvasDrawingTopLeftPoint!.y - Store.penSize() / 2, // source y
          width, // source width
          height, // source height
          0, // destination x
          0, // destination y
          width, // destination width
          height, // destination height
        );
        var mySerializedSVG = window.__canvasSvgContext.getSerializedSvg();

        const spawnPoint = screenToCanvas(
          window.__canvasDrawingTopLeftPoint!.x - Store.penSize() / 2,
          window.__canvasDrawingTopLeftPoint!.y - Store.penSize() / 2,
          Store.camera().x,
          Store.camera().y,
          Store.camera().z,
        );

        Store.addNewObject({
          type: eObjectType.SVG,
          svgDataUri: mySerializedSVG,
          width: width / Store.camera().z,
          height: height / Store.camera().z,
          x: spawnPoint.x,
          y: spawnPoint.y,
          originalDimensions: {
            width,
            height,
          },
        });

        window.__canvasContext!.clearRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight,
        );
      }}
    ></canvas>
  );
};
