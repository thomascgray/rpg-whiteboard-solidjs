import type { iBox, iCamera, iObject, iPoint } from "./types";
import * as Store from "./store";
import * as _ from "lodash";
import { produce } from "solid-js/store";

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

// make the camera zoom in relative to the cursor
export const zoomCamera = (
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  point: iPoint,
  dz: number
): iCamera => {
  let zoom = withMinMax(cameraZ - dz * cameraZ, 0.1, 4);

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
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

// wait this whole fuckin thing is backwards lol, coming to the front is a HIGHER z index
// export const sendSelectedObjectsToBack = () => {
//   const objs = { ...Store.objects };

//   console.log("objs", JSON.stringify(objs, null, 2));
//   // set the selected objects to have the highest z index, from 1 downwards
//   _.sortBy(Store.selectedObjectIds(), (id) => objs[id].zIndex)
//     .reverse() // because we want them desc because lower is "higher"
//     .forEach((id, index) => {
//       const obj = objs[id];
//       if (obj) {
//         obj.zIndex = index + 1;
//       }
//     });

//   // now, for the rest of the objects, do the exact same but
//   // add how many selected objects there are to the index
//   // so that they are all still in the correct order
//   _.sortBy(
//     Object.values(objs).filter(
//       (obj) => !Store.selectedObjectIds().includes(obj.id)
//     ),
//     (obj) => obj.zIndex
//   )
//     .reverse() // because we want them desc because lower is "higher"
//     .forEach((obj, index) => {
//       if (obj) {
//         obj.zIndex = index + 1 + Store.selectedObjectIds().length;
//       }
//     });

//   console.log("objs", JSON.stringify(objs, null, 2));
//   // Store.setObjects(objs);
//   // TODO fix this
//   Store.setObjects(
//     produce((objs) => {
//       objs = objs;
//     })
//   );
// };

export const sendSelectedObjectsToBack = () => {
  const objs = { ...Store.objects };

  const objIdsToZIndexes: any[][] = [];

  Object.values(objs).forEach((obj) => {
    objIdsToZIndexes.push([obj.id, obj.zIndex]);
  });

  // set the selected objects to have the highest z index, from 1 downwards
  _.sortBy(Store.selectedObjectIds(), (id) => objs[id].zIndex)
    // because we want them desc because lower is "higher"
    .forEach((id, index) => {
      const obj = objs[id];
      if (obj) {
        objIdsToZIndexes.push([obj.id, index]);
      }
    });

  // now, for the rest of the objects, do the exact same but
  // add how many selected objects there are to the index
  // so that they are all still in the correct order
  _.sortBy(
    Object.values(objs).filter(
      (obj) => !Store.selectedObjectIds().includes(obj.id)
    ),
    (obj) => obj.zIndex
  )
    // because we want them desc because lower is "higher"
    .forEach((obj, index) => {
      if (obj) {
        objIdsToZIndexes.push([
          obj.id,
          index + Store.selectedObjectIds().length,
        ]);
      }
    });

  objIdsToZIndexes.forEach(([id, zIndex]) => {
    Store.setObjects(id, { zIndex });
  });
};
