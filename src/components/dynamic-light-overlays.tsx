import { Component, createEffect } from "solid-js";
import { iObject, iPoint } from "../types";

function calculateShadow(origin: iPoint, walls: iPoint[][]): iPoint[][] {
  // Initialize an array to store shadow polygons
  const shadows: iPoint[][] = [];

  // Iterate through each wall polygon
  for (const wall of walls) {
    // Initialize an array to store the shadow vertices for this wall
    const shadowVertices: iPoint[] = [];

    // Iterate through each vertex of the wall polygon
    for (let i = 0; i < wall.length; i++) {
      const v1 = wall[i];
      const v2 = wall[(i + 1) % wall.length]; // Next vertex

      // Check if the origin is on one side of the wall
      const side1 = sideOfLine(origin, v1, v2);
      const side2 = sideOfLine(origin, v1, wall[(i + 2) % wall.length]); // Next next vertex

      console.log("side1", side1);
      console.log("side2", side2);
      // If origin is on different sides, it's a shadow edge
      if (side1 >= 0 && side2 < 0) {
        const intersection = computeIntersection(origin, v1, v2);
        shadowVertices.push(intersection);
      }
    }

    console.log("shadowVertices", shadowVertices);

    // Add the shadow polygon to the shadows array
    if (shadowVertices.length > 1) {
      shadows.push(shadowVertices);
    }
  }

  return shadows;
}

// Helper function to determine which side of a line a point is on
function sideOfLine(point: iPoint, lineStart: iPoint, lineEnd: iPoint): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const d = (point.x - lineStart.x) * dy - (point.y - lineStart.y) * dx;
  return Math.sign(d);
}

// Helper function to compute the intersection point of two lines
function computeIntersection(
  point: iPoint,
  lineStart: iPoint,
  lineEnd: iPoint,
): iPoint {
  const dx1 = point.x - lineStart.x;
  const dy1 = point.y - lineStart.y;
  const dx2 = lineEnd.x - lineStart.x;
  const dy2 = lineEnd.y - lineStart.y;
  const t = (dx1 * dy2 - dy1 * dx2) / (dx1 * dx2 + dy1 * dy2);
  const intersectionX = lineStart.x + t * dx2;
  const intersectionY = lineStart.y + t * dy2;
  return { x: intersectionX, y: intersectionY };
}

// Example usage:
const origin = { x: 2, y: 2 };
const walls = [
  [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ],
  [
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 5, y: 3 },
  ],
];

export const DynamicLighting: Component<{ object: iObject }> = (props) => {
  let canvasRef: any;

  const origin: iPoint = { x: 2, y: 2 };

  const walls: iPoint[][] = [
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ],
    [
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 5, y: 3 },
    ],
  ];

  const shadows = calculateShadow(origin, walls);

  createEffect(() => {
    const context = canvasRef.getContext("2d") as CanvasRenderingContext2D;
    if (!context) {
      return;
    }

    setTimeout(() => {
      context.beginPath();
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.rect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = "black";
      context.strokeStyle = "white";
      context.fill();

      context.closePath();

      console.log("shadows", JSON.stringify(shadows, null, 2));
    }, 1000);
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
