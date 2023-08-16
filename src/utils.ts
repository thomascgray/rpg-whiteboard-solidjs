import type { iBox, iCamera, iObject, iPoint } from "./types";

export const withMinMax = (val: number, min: number, max: number) => {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
};

export const screenToCanvas = (
  x: number,
  y: number,
  cameraX: number,
  cameraY: number,
  cameraZ: number
): iPoint => {
  return { x: x / cameraZ - cameraX, y: y / cameraZ - cameraY };
};

export const canvasToScreen = (point: iPoint, camera: iCamera): iPoint => {
  return {
    x: (point.x - camera.x) * camera.z,
    y: (point.y - camera.y) * camera.z,
  };
};

export const panCamera = (
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  dx: number,
  dy: number
): iCamera => {
  return {
    x: cameraX - dx / cameraZ,
    y: cameraY - dy / cameraZ,
    z: cameraZ,
  };
};

// make the camera zoom in relative to the cursor
export const zoomCamera = (
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  point: iPoint,
  dz: number
): iCamera => {
  let zoom = withMinMax(cameraZ - dz * cameraZ, 0.05, 4);

  const p1 = screenToCanvas(point.x, point.y, cameraX, cameraY, cameraZ);

  const p2 = screenToCanvas(point.x, point.y, cameraX, cameraY, zoom);

  return {
    x: cameraX + (p2.x - p1.x),
    y: cameraY + (p2.y - p1.y),
    z: zoom,
  };
};

export const checkOverlap = (obj1: iBox, obj2: iBox) => {
  return (
    obj1.pos.x < obj2.pos.x + obj2.dimensions.width &&
    obj1.pos.x + obj1.dimensions.width > obj2.pos.x &&
    obj1.pos.y < obj2.pos.y + obj2.dimensions.height &&
    obj1.pos.y + obj1.dimensions.height > obj2.pos.y
  );
};
