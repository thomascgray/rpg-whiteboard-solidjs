import { eObjectType, iObject } from "./types";
import * as Store from "./store";
import * as DOMUtils from "./dom-utils";

export const resizeBottomLeftToTopRight = (
  distanceX: number,
  distanceY: number
) => {};

export const resizeBottomRightToTopLeft = (
  distanceX: number,
  distanceY: number
) => {
  if (!window.__app_selectedObjects) {
    return;
  }
  const objectSelectionBoxElement = document.getElementById(
    "__object-selection-highlight-box"
  );

  if (!objectSelectionBoxElement) {
    return;
  }
  let newParentWidth =
    Number(objectSelectionBoxElement.dataset.width) + distanceX;
  let newParentHeight =
    Number(objectSelectionBoxElement.dataset.height) + distanceY;
  const ratio = Math.min(
    newParentWidth / Number(objectSelectionBoxElement.dataset.width),
    newParentHeight / Number(objectSelectionBoxElement.dataset.height)
  );

  const xList: number[] = [];
  const yList: number[] = [];

  for (let el of window.__app_selectedObjects) {
    const element = el as HTMLElement;

    const x1 =
      Number(objectSelectionBoxElement!.dataset.posX) -
      Number(element.dataset.posX);
    const x2 = x1 * ratio;
    const x3 = x1 - x2;
    const y1 =
      Number(objectSelectionBoxElement!.dataset.posY) -
      Number(element.dataset.posY);
    const y2 = y1 * ratio;
    const y3 = y1 - y2;

    const newX = Number(element.dataset.posX) + x3;
    const newY = Number(element.dataset.posY) + y3;
    const newWidth = Number(element.dataset.width) * ratio;
    const newHeight = Number(element.dataset.height) * ratio;

    xList.push(newX + newWidth);
    yList.push(newY + newHeight);

    // if its a text object, we ALSO need to recalculate the font ize by like, the fuckin ratio of the new
    // width to the old width?
    if (element.dataset.objectType === eObjectType.TEXT) {
      DOMUtils.setStylesOnElement(element, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        fontSize: Number(element.dataset.fontSize) * ratio,
        // lineHeight: Number(element.dataset.lineHeight) * ratio,
      });
    } else {
      DOMUtils.setStylesOnElement(element, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }

  // move the selection box...
  const newWidth =
    Math.max(...xList) - Number(objectSelectionBoxElement.dataset.posX);
  const newHeight =
    Math.max(...yList) - Number(objectSelectionBoxElement.dataset.posY);
  DOMUtils.setStylesOnElement(objectSelectionBoxElement, {
    width: newWidth,
    height: newHeight,
  });

  // now move the resize handles
  // left one just needs to go up by the amount that the box has gone up
  const resizeHandleLeft = document.getElementById("__resize_handle_left");
  const resizeHandleRight = document.getElementById("__resize_handle_right");

  const leftX = Number(resizeHandleLeft!.dataset.posX);
  const leftY = Number(objectSelectionBoxElement.dataset.posY) + newHeight;
  DOMUtils.setStylesOnElement(resizeHandleLeft!, { x: leftX, y: leftY });

  const rightX =
    Number(resizeHandleRight!.dataset.posX) -
    (Number(objectSelectionBoxElement.dataset.width) - newWidth);
  const rightY = Number(objectSelectionBoxElement.dataset.posY) + newHeight;
  DOMUtils.setStylesOnElement(resizeHandleRight!, { x: rightX, y: rightY });
};
