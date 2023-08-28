import { Component, createEffect } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { iObject } from "./types";

export const calculateFinalSquareSize = (
  canvasWidth: number,
  totalUnitsAcross: number,
) => {
  const squareSize = Math.floor(canvasWidth / totalUnitsAcross);

  return squareSize;
};

export const BattlemapFeatures: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  createEffect(() => {
    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    const squareSize = calculateFinalSquareSize(canvasRef.width, 20);
    const numberOfSquaresX = Math.ceil(canvasRef.width / squareSize);
    const numberOfSquaresY = Math.ceil(canvasRef.height / squareSize);
    // // clear the canvas
    context.clearRect(0, 0, canvasRef.width, canvasRef.height);
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
