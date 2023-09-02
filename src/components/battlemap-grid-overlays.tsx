import { Component, createEffect } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { eTool, iObject } from "../types";
import * as BattlemapUtils from "../utils/battlemap-utils";
import * as Store from "../store";

export const SquaresOverlay: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    const squareSize = BattlemapUtils.calculateFinalSquareSize(
      props.object.width,
      props.object.squaresAcross || 20,
    );
    console.log("render square battlemap");
    console.log("squareSize", squareSize);
    const numberOfSquaresX = Math.ceil(props.object.width / squareSize);
    const numberOfSquaresY = Math.ceil(props.object.height / squareSize);
    // // clear the canvas
    context.clearRect(0, 0, props.object.width, props.object.height);
    context.beginPath();
    // // work out how many squares we need to draw
    // // now draw the squares
    for (let x = 0; x < numberOfSquaresX; x++) {
      for (let y = 0; y < numberOfSquaresY; y++) {
        context.rect(
          x * squareSize + 0,
          y * squareSize + 0,
          squareSize,
          squareSize,
        );
      }
    }

    context.strokeStyle = "#FFF";
    context.lineWidth = 2;
    context.globalAlpha = 0.2;
    context.stroke();
  });

  return (
    <canvas
      onMouseDown={(e) => {
        // e.stopPropagation();
        // e.preventDefault();
        // we need to set the global measuring distance to whatever this canvases square size is
        console.log("aaaaa");
        const squareSize = BattlemapUtils.calculateFinalSquareSize(
          props.object.width,
          props.object.squaresAcross || 20,
        );
        Store.setMeasuringScale(squareSize);
      }}
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
      class="canvas-capture absolute left-0 top-0 w-full"
      classList={{
        "pointer-events-none": Store.selectedTool() !== eTool.MEASURING,
      }}
    ></canvas>
  );
};

export const HexesFlatTopOverlay: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.strokeStyle = "#FFF";
    context.lineWidth = 2;
    context.globalAlpha = 0.2;

    BattlemapUtils.drawGrid_FlatTop(
      context,
      props.object.width,
      props.object.height,
      props.object.squaresAcross || 20,
      props.object.squaresAcross || 20,
    );
    context.closePath();
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
      class="canvas-capture pointer-events-none absolute left-0 top-0 w-full"
    ></canvas>
  );
};

export const HexesPointyTopOverlay: Component<{ object: iObject }> = (
  props,
) => {
  let canvasRef: any;

  createEffect(() => {
    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.strokeStyle = "#FFF";
    context.lineWidth = 2;
    context.globalAlpha = 0.2;

    BattlemapUtils.drawGrid_PointyTop(
      context,
      props.object.width,
      props.object.height,
      props.object.squaresAcross || 20,
      props.object.squaresAcross || 20,
    );
    context.closePath();
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
      class="canvas-capture pointer-events-none absolute left-0 top-0 w-full"
    ></canvas>
  );
};
