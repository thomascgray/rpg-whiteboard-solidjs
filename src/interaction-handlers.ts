import { eKey, eResizingFrom, iCamera, iObject, type iState } from "./types";
import * as Utils from "./utils";
import * as DOMUtils from "./dom-utils";
import * as Store from "./store";
import * as ResizeUtils from "./resize-utils";
import * as _ from "lodash";

export const interactionPanCamera = (movementX: number, movementY: number) => {
  const cameraDom = document.getElementById("camera");
  if (!cameraDom) {
    return;
  }

  const deltaX = movementX;
  const deltaY = movementY;

  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  cameraDom.style.transform = `scale(${z}) translate(${x - deltaX / z}px, ${
    y - deltaY / z
  }px)`;
  // @ts-ignore
  if (window.scrollingSetTimeout) {
    // @ts-ignore
    clearTimeout(window.scrollingSetTimeout);
  }
  // @ts-ignore
  window.scrollingSetTimeout = setTimeout(() => {
    Store.setCamera({ x, y, z });
    cameraDom.dataset.posX = String(x);
    cameraDom.dataset.posY = String(y);
    cameraDom.dataset.posZ = String(z);
  }, 66);
};

export const interactionMoveObjects = (e: MouseEvent) => {
  if (!window.__app_selectedObjects) {
    return;
  }
  const camera = Store.camera();
  const mouseDownPosCanvas = Store.mouseDownPosCanvas();

  const mousePoint = Utils.screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z
  );

  // move the elements themeslves, and work out the top-left most set of coords
  // const elements = document.getElementsByClassName("__selected-object");
  const xList: number[] = [];
  const yList: number[] = [];
  for (let el of window.__app_selectedObjects) {
    const element = el as HTMLElement;
    const x =
      Number(element.dataset.posX) + (mousePoint.x - mouseDownPosCanvas.x);
    const y =
      Number(element.dataset.posY) + (mousePoint.y - mouseDownPosCanvas.y);
    xList.push(x);
    yList.push(y);
    DOMUtils.setStylesOnElement(element, { x, y });
  }

  // using the top-left most set of coords, move the selection box
  const objectSelectionBoxElement = document.getElementById(
    "__object-selection-highlight-box"
  );
  const minX = _.min(xList) as number;
  const minY = _.min(yList) as number;
  DOMUtils.setStylesOnElement(objectSelectionBoxElement!, { x: minX, y: minY });

  // also move the resize handles by the amount the mouse has moved
  const resizeHandles = document.getElementsByClassName("__resize-handle");
  for (let el of resizeHandles) {
    const resizeHandleElement = el as HTMLElement;
    const x =
      Number(resizeHandleElement.dataset.posX) +
      (mousePoint.x - mouseDownPosCanvas.x);
    const y =
      Number(resizeHandleElement.dataset.posY) +
      (mousePoint.y - mouseDownPosCanvas.y);
    DOMUtils.setStylesOnElement(resizeHandleElement!, { x, y });
  }
};

export const interactionResizeObjects = (e: MouseEvent) => {
  const camera = Store.camera();
  const mouseDownPosCanvas = Store.mouseDownPosCanvas();

  const mousePoint = Utils.screenToCanvas(
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
  }

  if (Store.isResizingFrom() === eResizingFrom.BOTTOM_RIGHT) {
    ResizeUtils.resizeBottomRightToTopLeft(diff.x, diff.y);
  }
};

export const interactionZoomCamera = (e: WheelEvent) => {
  let scrollValue = e.deltaY;
  if (Math.abs(e.deltaY) === 100) {
    scrollValue = scrollValue * 0.1;
  }
  if (scrollValue > 30) {
    scrollValue = 30;
  } else if (scrollValue < -30) {
    scrollValue = -30;
  }

  const cameraDom = document.getElementById("camera");
  const canvasDom = document.getElementById("canvas");
  if (!cameraDom || !canvasDom) {
    return;
  }

  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  const newCamera = Utils.zoomCamera(
    x,
    y,
    z,
    { x: e.clientX, y: e.clientY },
    scrollValue / 100
  );
  cameraDom.style.transform = `scale(${newCamera.z}) translate(${newCamera.x}px, ${newCamera.y}px)`;

  // update the app zoom factor on the canvas
  canvasDom.style.setProperty("--app-camera-zoom", String(newCamera.z));

  // @ts-ignore
  if (window.scrollingSetTimeout) {
    // @ts-ignore
    clearTimeout(window.scrollingSetTimeout);
  }
  // @ts-ignore
  window.scrollingSetTimeout = setTimeout(() => {
    Store.setCamera(newCamera);
    cameraDom.dataset.posX = String(newCamera.x);
    cameraDom.dataset.posY = String(newCamera.y);
    cameraDom.dataset.posZ = String(newCamera.z);
  }, 80);
};
