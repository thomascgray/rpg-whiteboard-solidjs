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

export const panCamera = (camera: iCamera, dx: number, dy: number): iCamera => {
  return {
    x: camera.x - dx / camera.z,
    y: camera.y - dy / camera.z,
    z: camera.z,
  };
};

export const zoomCamera = (
  camera: iCamera,
  point: iPoint,
  dz: number
): iCamera => {
  let zoom = withMinMax(camera.z - dz * camera.z, 0.1, 4);

  const p1 = screenToCanvas(point.x, point.y, camera.x, camera.y, camera.z);

  const p2 = screenToCanvas(point.x, point.y, camera.x, camera.y, zoom);

  return {
    x: camera.x + (p2.x - p1.x),
    y: camera.y + (p2.y - p1.y),
    z: zoom,
  };
};

// export const cullToObjectsOnScreen = (objects: iObject[]) => {
// 	// return objects.filter((object) => isObjectInViewport(object, camera));
// 	console.log('a');
// 	return objects;
// };

export const checkOverlap = (obj1: iBox, obj2: iBox) => {
  return (
    obj1.pos.x < obj2.pos.x + obj2.dimensions.width &&
    obj1.pos.x + obj1.dimensions.width > obj2.pos.x &&
    obj1.pos.y < obj2.pos.y + obj2.dimensions.height &&
    obj1.pos.y + obj1.dimensions.height > obj2.pos.y
  );
};
