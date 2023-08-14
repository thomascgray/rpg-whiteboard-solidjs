import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import {
  eKey,
  eMouseButton,
  eObjectType,
  eResizingFrom,
  iBox,
  iCamera,
  iObject,
  iPoint,
} from "./types";

/**
 * OK, so
 *
 * Every piece of state is its own signal. This is so that when we update
 * a single piece of it, only the components that are using that piece of state update.
 *
 * The best way to use the store is to do something like:
 *      `import * as Store from '../store';`
 * at the top of your file, and then give it an ol'
 *      Store.heldKeys();
 * inside the file
 */

// every individual piece of state is stored in a separate writable store

// you use them by doing a fuckin `import * as Store from 'store'`

// 1. all the objects are in a big map
export const [objects, setObjects] = createStore<{ [key: string]: iObject }>(
  {}
);

// 2. we have the keyboard and mouse buttons that the user is pressing

export const [heldMouseButtons, setHeldMouseButtons] = createSignal<
  eMouseButton[]
>([]);
export const [heldKeys, setHeldKeys] = createSignal<eKey[]>([]);

export const [camera, setCamera] = createSignal<iCamera>({
  x: 0,
  y: 0,
  z: 1,
});

// 3. everything else is basically "interaction" state. e.g what objects are selected, is the user dragging, etc.
// selectedObjectIds: string[];

export const [selectedObjectIds, setSelectedObjectIds] = createSignal<string[]>(
  []
);

export const [isSelectingMultipleObjects, setIsSelectingMultipleObjects] =
  createSignal<boolean>(false);
export const [isFocusedInTextbox, setIsFocusedInTextbox] =
  createSignal<boolean>(false);
export const [isDrawingSelectionBox, setIsDrawingSelectionBox] =
  createSignal<boolean>(false);

export const [drawingSelectionBoxStartPos, setDrawingSelectionBoxStartPos] =
  createSignal<iPoint>({ x: 0, y: 0 });
export const [drawingSelectionBoxWidth, setDrawingSelectionBoxWidth] =
  createSignal<number>(0);
export const [drawingSelectionBoxHeight, setDrawingSelectionBoxHeight] =
  createSignal<number>(0);

export const [isPanning, setIsPanning] = createSignal<boolean>(false);

export const [mouseDownPos, setMouseDownPos] = createSignal<iPoint>({
  x: 0,
  y: 0,
});
export const [mouseDownPosCanvas, setMouseDownPosCanvas] = createSignal<iPoint>(
  { x: 0, y: 0 }
);

export const [isResizingFrom, setIsResizingFrom] =
  createSignal<eResizingFrom | null>(null);

export const [objectSelectionBoxWidth, setObjectSelectionBoxWidth] =
  createSignal<number>(0);
export const [objectSelectionBoxHeight, setObjectSelectionBoxHeight] =
  createSignal<number>(0);
export const [objectSelectionBoxPosX, setObjectSelectionBoxPosX] =
  createSignal<number>(0);
export const [objectSelectionBoxPosY, setObjectSelectionBoxPosY] =
  createSignal<number>(0);

export const [
  objectSelectionBoxWidthPreResize,
  setObjectSelectionBoxWidthPreResize,
] = createSignal<number>(0);
export const [
  objectSelectionBoxHeightPreResize,
  setObjectSelectionBoxHeightPreResize,
] = createSignal<number>(0);

/**
 *
 * A bunch of state/store helpers
 *
 *
 */
export const unselectObjects = () => {
  // if any of the objects we're about to unselect are a text area, we need
  // to make that text area unfocused

  const objs = objects;
  selectedObjectIds().forEach((id) => {
    const obj = objs[id];
    if (obj && obj?.type === eObjectType.TEXT) {
      objs[id] = {
        ...obj,
        isFocused: false,
      };
    }
  });
  setObjects(objs);
  setIsFocusedInTextbox(Object.values(objs).some((obj) => obj.isFocused));
  setSelectedObjectIds([]);
  recalculateObjectSelectionBoxPos();
  recalculateObjectSelectionBoxWidthAndHeight();
  setIsSelectingMultipleObjects(false);

  window.getSelection()!.removeAllRanges();
};

export const recalculateObjectSelectionBoxPos = () => {
  if (selectedObjectIds().length === 0) {
    setObjectSelectionBoxPosX(0);
    setObjectSelectionBoxPosY(0);
  }
  const selectedObjects = () => {
    return Object.values(objects).filter((obj) =>
      selectedObjectIds().includes(obj.id)
    );
  };
  const tlXs = () => {
    return selectedObjects().map((obj) => obj.pos.x);
  };
  const tlYs = () => {
    return selectedObjects().map((obj) => obj.pos.y);
  };
  setObjectSelectionBoxPosX(Math.min(...tlXs()));
  setObjectSelectionBoxPosY(Math.min(...tlYs()));
};

export const recalculateObjectSelectionBoxWidthAndHeight = () => {
  if (selectedObjectIds().length === 0) {
    setObjectSelectionBoxWidth(0);
    setObjectSelectionBoxHeight(0);
  }
  const selectedObjects = () => {
    return Object.values(objects).filter((obj) =>
      selectedObjectIds().includes(obj.id)
    );
  };
  const tlXs = () => {
    return selectedObjects().map((obj) => obj.pos.x);
  };
  const tlYs = () => {
    return selectedObjects().map((obj) => obj.pos.y);
  };
  const brXs = () => {
    return selectedObjects().map((obj) => obj.pos.x + obj.dimensions.width);
  };
  const brYs = () => {
    return selectedObjects().map((obj) => obj.pos.y + obj.dimensions.height);
  };
  const topLeftPoint = () => {
    return {
      x: Math.min(...tlXs()),
      y: Math.min(...tlYs()),
    };
  };
  const bottomRightPoint = () => {
    return {
      x: Math.max(...brXs()),
      y: Math.max(...brYs()),
    };
  };

  setObjectSelectionBoxWidth(bottomRightPoint().x - topLeftPoint().x);
  setObjectSelectionBoxHeight(bottomRightPoint().y - topLeftPoint().y);
};

export const getObjectById = (id: string) => {
  return objects[id];
};
