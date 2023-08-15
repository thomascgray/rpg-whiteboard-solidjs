import { eObjectType, iObject } from "./types";
import * as Store from "./store";
import * as DOMUtils from "./dom-utils";

export const resizeBottomLeftToTopRight = (
  distanceX: number,
  distanceY: number
) => {
  let newParentWidth = () =>
    Store.objectSelectionBoxWidthPreResize() + distanceX;
  let newParentHeight = () =>
    Store.objectSelectionBoxHeightPreResize() + distanceY;

  const ratio = () =>
    Math.min(
      newParentWidth() / Store.objectSelectionBoxWidthPreResize(),
      newParentHeight() / Store.objectSelectionBoxHeightPreResize()
    );
  const newWidthWithRatio = Store.objectSelectionBoxWidthPreResize() * ratio();

  const newParentXWithRatio =
    Store.objectSelectionBoxPosX() -
    (newWidthWithRatio - Store.objectSelectionBoxWidthPreResize());

  Store.selectedObjectIds().forEach((id) => {
    const object = Store.getObjectById(id);
    const x1 = Store.objectSelectionBoxPosX() - object.preResizePos.x;
    const x2 = x1 * ratio();
    const x3 = x1 - x2;
    const y1 = Store.objectSelectionBoxPosY() - object.preResizePos.y;
    const y2 = y1 * ratio();
    const y3 = y1 - y2;

    const parentDiff = Store.objectSelectionBoxPosX() - newParentXWithRatio;

    const newX = object.preResizePos.x + x3 - parentDiff;
    const newY = object.preResizePos.y + y3;
    const newWidth = object.dimensions.width * ratio();
    const newHeight = object.dimensions.height * ratio();

    Store.setObjects(object.id, {
      pos: {
        x: newX,
        y: newY,
      },
      dimensions: {
        width: newWidth,
        height: newHeight,
      },
    });
  });
};

export const resizeBottomRightToTopLeft = (
  distanceX: number,
  distanceY: number
) => {
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

  const elements = DOMUtils.getAllCurrentlySelectedObjectDOMElements();
  for (let el of elements) {
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

    DOMUtils.setCoordsAndDimensionsOnElement(
      element,
      newX,
      newY,
      newWidth,
      newHeight
    );
  }
};
