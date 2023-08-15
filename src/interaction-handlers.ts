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
  const mouseDownPosCanvas = Store.mouseDownPosCanvas();

  const mousePoint = screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z
  );

  const elements = document.getElementsByClassName("__selected-object");
  for (let el of elements) {
    const element = el as HTMLElement;
    const x =
      Number(element.dataset.predragX) + (mousePoint.x - mouseDownPosCanvas.x);
    const y =
      Number(element.dataset.predragY) + (mousePoint.y - mouseDownPosCanvas.y);
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.dataset.translate = `${x}/${y}`;
  }

  // we also need to recalculate all the selection box and resize handles fml
  // make some helper functions to do this that take in all the elements, etc.
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
