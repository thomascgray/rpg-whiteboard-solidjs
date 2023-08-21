import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eMouseButton, eTool } from "../types";

export const SketchingCanvas: Component = (props) => {
  return (
    <canvas
      id="canvas"
      class="absolute top-0 left-0 w-full h-full"
      width={screen.width}
      height={screen.height}
      classList={{
        "pointer-events-none": Store.selectedTool() !== eTool.SKETCH,
      }}
      onMouseDown={(e) => {
        window.__canvasContext = document
          .getElementById("canvas")!
          .getContext("2d");

        console.log("context", window.__canvasContext);
        if (!window.__canvasContext) {
          return;
        }
        window.__canvasContext.globalCompositeOperation = "source-over";
        let cameraZ = Store.camera().z;

        window.__canvasContext.beginPath();
        window.__canvasContext.strokeStyle = "#000";
        window.__canvasContext.fillStyle = "#000";
        window.__canvasContext.lineJoin = "round";
        window.__canvasContext.lineWidth = 5;

        window.__canvasContext.moveTo(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => {
        if (!Store.heldMouseButtons().includes(eMouseButton.LEFT)) {
          return;
        }
        if (!window.__canvasContext) {
          return;
        }
        window.__canvasContext.globalCompositeOperation = "source-over";

        window.__canvasContext.lineTo(e.clientX, e.clientY);
        window.__canvasContext.stroke();
      }}
    ></canvas>
  );
};
