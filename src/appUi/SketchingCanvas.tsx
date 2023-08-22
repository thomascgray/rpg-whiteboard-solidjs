import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eMouseButton, eObjectType, eTool } from "../types";

// @ts-ignore
import C2S from "canvas2svg";
import svgToTinyDataUri from "mini-svg-data-uri";

export const SketchingCanvas: Component = (props) => {
  return (
    <canvas
      id="canvas"
      class="absolute top-0 left-0 w-full h-full"
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
        window.__canvasContext!.strokeStyle = "#000";
        window.__canvasContext!.lineJoin = "round";
        window.__canvasContext!.lineWidth = 5;
        window.__canvasContext!.moveTo(e.pageX, e.pageY);

        // window.__canvasSvgContext = new C2S(
        //   window.innerWidth,
        //   window.innerHeight
        // );

        // window.__canvasSvgContext!.beginPath();
        // window.__canvasSvgContext!.strokeStyle = "#F00";
        // window.__canvasSvgContext!.lineJoin = "round";
        // window.__canvasSvgContext!.lineWidth = 5;
        // window.__canvasSvgContext!.moveTo(e.pageX, e.pageY);
      }}
      onMouseMove={(e) => {
        if (!Store.heldMouseButtons().includes(eMouseButton.LEFT)) {
          return;
        }
        window.__canvasContext!.globalCompositeOperation = "source-over";

        window.__canvasContext!.lineTo(e.pageX, e.pageY);
        window.__canvasContext!.stroke();

        // window.__canvasSvgContext!.lineTo(e.pageX, e.pageY);
        // window.__canvasSvgContext!.stroke();

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

        console.log("width", width);
        console.log("height", height);
        window.__canvasSvgContext.drawImage(
          window.__canvasDom,
          window.__canvasDrawingTopLeftPoint!.x - 5,
          window.__canvasDrawingTopLeftPoint!.y - 5,
          window.__canvasDrawingBottomRightPoint!.x + 5, // source width
          window.__canvasDrawingBottomRightPoint!.y + 5, // source height
          0,
          0,
          window.__canvasDrawingBottomRightPoint!.x - 15,
          window.__canvasDrawingBottomRightPoint!.y - 15
        );
        var mySerializedSVG = window.__canvasSvgContext.getSerializedSvg();

        Store.addNewObject({
          type: eObjectType.SVG,
          svgDataUri: svgToTinyDataUri(mySerializedSVG),
          width,
          height,
        });

        window.__canvasContext!.clearRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );
      }}
    ></canvas>
  );
};
