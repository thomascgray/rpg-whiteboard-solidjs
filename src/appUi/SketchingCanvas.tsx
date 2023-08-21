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

        window.__canvasContext!.beginPath();
        window.__canvasContext!.strokeStyle = "#000";
        window.__canvasContext!.fillStyle = "#000";
        window.__canvasContext!.lineJoin = "round";
        window.__canvasContext!.lineWidth = 5;

        window.__canvasContext!.moveTo(e.pageX, e.pageY);

        window.__canvasSvgContext = new C2S(
          window.innerWidth,
          window.innerHeight
        );

        window.__canvasSvgContext!.moveTo(e.pageX, e.pageY);
      }}
      onMouseMove={(e) => {
        if (!Store.heldMouseButtons().includes(eMouseButton.LEFT)) {
          return;
        }
        window.__canvasContext!.globalCompositeOperation = "source-over";

        window.__canvasContext!.lineTo(e.pageX, e.pageY);
        window.__canvasContext!.stroke();

        window.__canvasSvgContext!.lineTo(e.pageX, e.pageY);
        window.__canvasSvgContext!.stroke();
      }}
      onMouseUp={(e) => {
        //draw your canvas like you would normally
        var mySerializedSVG = window.__canvasSvgContext.getSerializedSvg();

        console.log(svgToTinyDataUri(mySerializedSVG));
        Store.addNewObject({
          type: eObjectType.SVG,
          svgDataUri: svgToTinyDataUri(mySerializedSVG),
        });
      }}
    ></canvas>
  );
};
