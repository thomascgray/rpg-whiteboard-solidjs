import { eObjectType, iObject } from "./types";
import * as Store from "./store";

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
  let newParentWidth = () =>
    Store.objectSelectionBoxWidthPreResize() + distanceX;
  let newParentHeight = () =>
    Store.objectSelectionBoxHeightPreResize() + distanceY;
  const ratio = () =>
    Math.min(
      newParentWidth() / Store.objectSelectionBoxWidthPreResize(),
      newParentHeight() / Store.objectSelectionBoxHeightPreResize()
    );

  Store.selectedObjectIds().forEach((id) => {
    const x1 =
      Store.objectSelectionBoxPosX() - Store.objects[id].preResizePos.x;
    const x2 = x1 * ratio();
    const x3 = x1 - x2;
    const y1 =
      Store.objectSelectionBoxPosY() - Store.objects[id].preResizePos.y;
    const y2 = y1 * ratio();
    const y3 = y1 - y2;

    const newX = Store.objects[id].preDragPos.x + x3;
    const newY = Store.objects[id].preDragPos.y + y3;
    const newWidth = Store.objects[id].preResizeDimensions.width * ratio();
    const newHeight = Store.objects[id].preResizeDimensions.height * ratio();

    Store.setObjects(id, {
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
