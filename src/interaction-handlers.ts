import { eKey, eResizingFrom, iObject, type iState } from "./types";
import { panCamera, screenToCanvas } from "./utils";
import * as Store from "./store";
import * as ResizeUtils from "./resize-utils";
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

  Store.recalculateObjectSelectionBoxPos();
};

export const interactionResizeObjects = (e: MouseEvent) => {
  const camera = Store.camera();
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

  if (Store.isResizingFrom() === eResizingFrom.BOTTOM_LEFT) {
    ResizeUtils.resizeBottomLeftToTopRight(diff.x, diff.y);
    Store.recalculateObjectSelectionBoxWidthAndHeight();
  }

  if (Store.isResizingFrom() === eResizingFrom.BOTTOM_RIGHT) {
    ResizeUtils.resizeBottomRightToTopLeft(diff.x, diff.y);
    Store.recalculateObjectSelectionBoxWidthAndHeight();
  }
};
