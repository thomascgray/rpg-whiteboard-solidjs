import { eKey, iObject, type iState } from "./types";
import { panCamera, screenToCanvas } from "./utils";
import * as Store from "./store";
import * as _ from "lodash";

export const interactionPanCamera = (movementX: number, movementY: number) => {
  const deltaX = -movementX;
  const deltaY = -movementY;

  Store.setCamera((camera) => panCamera(camera, deltaX, deltaY));
};

export const interactionMoveObjects = (e: MouseEvent) => {
  const camera = Store.camera();
  const existingObjects = Store.objects;
  const selectedObjectIds = Store.selectedObjectIds();
  const mouseDownPosCanvas = Store.mouseDownPosCanvas();

  const mousePoint = screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z
  );
  const diff = {
    x: mousePoint.x - mouseDownPosCanvas.x,
    y: mousePoint.y - mouseDownPosCanvas.y,
  };

  const len = selectedObjectIds.length;
  for (var x = 0; x < len; x++) {
    const id = selectedObjectIds[x];
    const obj = existingObjects[id];

    Store.setObjects(id, {
      pos: {
        x: obj.preDragPos.x + diff.x,
        y: obj.preDragPos.y + diff.y,
      },
    });
  }
};

export const interactionResizeObjects = (e: MouseEvent) => {
  const camera = Store.camera();
  const existingObjects = Store.objects;
  const selectedObjectIds = Store.selectedObjectIds();
  const mouseDownPosCanvas = Store.mouseDownPosCanvas();

  const mousePoint = screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z
  );
  const diff = {
    x: mousePoint.x - mouseDownPosCanvas.x,
    y: mousePoint.y - mouseDownPosCanvas.y,
  };

  // TODO
  // also none of this works for bottom left resizing

  // if we're holding shift, DONT use aspect ratio
  if (Store.heldKeys().includes(eKey.SHIFT)) {
    // this doesn't properly handle more than 1 object
    // it SORT OF works, but its resizing "too far"
    // like it resizes them each by the diff respective to themselves,
    // and not the area as a whole? sort of?

    const len = selectedObjectIds.length;
    for (var x = 0; x < len; x++) {
      const id = selectedObjectIds[x];
      const obj = existingObjects[id];

      Store.setObjects(id, {
        dimensions: {
          width: obj.preResizeDimensions.width + diff.x,
          height: obj.preResizeDimensions.height + diff.y,
        },
      });
    }
  } else {
    // TODO THIS WORKS, MAKE IT FAST
    const len = selectedObjectIds.length;
    for (var x = 0; x < len; x++) {
      const id = selectedObjectIds[x];
      const obj = existingObjects[id];

      const newWidth = obj.preResizeDimensions.width + diff.x;
      const newHeight = obj.preResizeDimensions.height + diff.y;
      const xRatio = newWidth / obj.preResizeDimensions.width;
      const yRatio = newHeight / obj.preResizeDimensions.height;
      const ratio = Math.min(xRatio, yRatio);

      Store.setObjects(id, {
        dimensions: {
          width: obj.preResizeDimensions.width * ratio,
          height: obj.preResizeDimensions.height * ratio,
        },
      });
    }
  }
};
