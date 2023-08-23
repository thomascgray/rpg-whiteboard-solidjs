import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eMouseButton, eObjectType, eTool } from "../types";

// @ts-ignore
import C2S from "canvas2svg";
import svgToTinyDataUri from "mini-svg-data-uri";
import { screenToCanvas } from "../utils/general-utils";

// todo something in here is causing console errors?
export const SketchingCanvas: Component = (props) => {
  return (
    <canvas
      id="canvas"
      class="absolute left-0 top-0 h-full w-full"
      width={window.innerWidth}
      height={window.innerHeight}
      classList={{
        "pointer-events-none": Store.selectedTool() !== eTool.SKETCH,
      }}
      onMouseDown={(e) => {
        window.__canvasContext!.globalCompositeOperation = "source-over";
        let cameraZ = Store.camera().z;

        // the points start out at the opposite ends
        window.__canvasDrawingTopLeftPoint = {
          x: window.innerWidth,
          y: window.innerHeight,
        };
        window.__canvasDrawingBottomRightPoint = {
          x: 0,
          y: 0,
        };
        window.__canvasContext!.beginPath();
        window.__canvasContext!.strokeStyle = Store.penColour();
        window.__canvasContext!.lineJoin = "round";
        window.__canvasContext!.lineWidth = Store.penSize();
        window.__canvasContext!.moveTo(e.pageX, e.pageY);
      }}
      onMouseMove={(e) => {
        if (!Store.heldMouseButtons().includes(eMouseButton.LEFT)) {
          return;
        }
        window.__canvasContext!.globalCompositeOperation = "source-over";

        window.__canvasContext!.lineTo(e.pageX, e.pageY);
        window.__canvasContext!.stroke();

        // as we move, we update the top left and bottom right points
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
        const width =
          window.__canvasDrawingBottomRightPoint!.x -
          window.__canvasDrawingTopLeftPoint!.x;

        const height =
          window.__canvasDrawingBottomRightPoint!.y -
          window.__canvasDrawingTopLeftPoint!.y;

        //draw your canvas like you would normally
        window.__canvasSvgContext = new C2S(width, height);

        // doing draw image results in blurry svg, maybe we DO need to mirror the inputs
        // against both contexts, hmm, more math required
        window.__canvasSvgContext.drawImage(
          window.__canvasDom,
          window.__canvasDrawingTopLeftPoint!.x - 5,
          window.__canvasDrawingTopLeftPoint!.y - 5,
          window.__canvasDrawingBottomRightPoint!.x + 5, // source width
          window.__canvasDrawingBottomRightPoint!.y + 5, // source height
          0,
          0,
          window.__canvasDrawingBottomRightPoint!.x - 15,
          window.__canvasDrawingBottomRightPoint!.y - 15,
        );
        var mySerializedSVG = window.__canvasSvgContext.getSerializedSvg();

        const spawnPoint = screenToCanvas(
          window.__canvasDrawingTopLeftPoint!.x,
          window.__canvasDrawingTopLeftPoint!.y,
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

        // TODO we should only go back to DEFAULT tool if the sketch was pretty big?
        // if (e.button === eMouseButton.LEFT) {
        //   Store.setSelectedTool(eTool.DEFAULT);
        // }
      }}
    ></canvas>
  );
};
