import type { iBox, iCamera, iObject, iPoint } from "../types";
import * as Store from "../store";
import * as _ from "lodash";
import { produce, reconcile } from "solid-js/store";

export const withMinMax = (
  val: number,
  min: number = -Infinity,
  max: number = Infinity,
) => {
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
  cameraZ: number,
): iPoint => {
  return { x: x / cameraZ - cameraX, y: y / cameraZ - cameraY };
};

export const canvasToScreen = (point: iPoint, camera: iCamera): iPoint => {
  return {
    x: (point.x - camera.x) * camera.z,
    y: (point.y - camera.y) * camera.z,
  };
};

// make the camera zoom in relative to the cursor
export const zoomCamera = (
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  point: iPoint,
  dz: number,
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

export const isPointInsideBox = (point: iPoint, box: iBox) => {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
};

export const checkOverlap = (obj1: iBox, obj2: iBox) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

export const sendSelectedObjectsToBack = () => {
  const objs = [...Store.objects];

  const selectedIndexesToUse = Array.from(
    Array(Store.selectedObjectIds().length).keys(),
  );

  // change all the z indexes of the selected objects
  _.sortBy(
    Store.selectedObjectIds(),
    (id) => objs[objs.findIndex((o) => o.id === id)!].zIndex,
  ).forEach((id) => {
    const obj = objs.find((o) => o.id === id)!;
    const objIndex = objs.findIndex((o) => o.id === id);
    objs[objIndex] = {
      ...obj,
      zIndex: selectedIndexesToUse.shift() as number,
    };
  });

  // change all the z indexes of the non-selected objects
  _.sortBy(objs, (o) => o.zIndex)
    .filter((o) => !Store.selectedObjectIds().includes(o.id))
    .forEach((obj, i) => {
      const objIndex = objs.findIndex((o) => o.id === obj.id);

      objs[objIndex] = {
        ...obj,
        zIndex: i + Store.selectedObjectIds().length,
      };
    });

  Store.setObjects(reconcile(objs));
};

export const calculateRotationAngle = (point1: iPoint, point2: iPoint) => {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;

  // Calculate the angle in radians
  let angleRad = Math.atan2(deltaY, deltaX);

  // Convert radians to degrees
  let angleDeg = (angleRad * 180) / Math.PI;

  // Ensure the angle is between 0 and 360 degrees
  if (angleDeg < 0) {
    angleDeg += 360;
  }

  // Adjust the angle to have 180 degrees for straight "down"
  angleDeg += 180;

  // Ensure the adjusted angle is between 0 and 360 degrees
  if (angleDeg >= 360) {
    angleDeg -= 360;
  }

  return angleDeg;
};

export const calculateMidpoint = (point1: iPoint, point2: iPoint) => {
  // Calculate the midpoint coordinates
  const midpointX = (point1.x + point2.x) / 2;
  const midpointY = (point1.y + point2.y) / 2;

  // Create and return a new point representing the midpoint
  const midpoint = { x: midpointX, y: midpointY };
  return midpoint;
};
