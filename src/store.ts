import { createMemo, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

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
export const [objects, setObjects] = createStore<iObject[]>([]);

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

export const [mouseDownPos, setMouseDownPos] = createSignal<iPoint>({
  x: 0,
  y: 0,
});
export const [mouseDownPosCanvas, setMouseDownPosCanvas] = createSignal<iPoint>(
  { x: 0, y: 0 }
);

export const [isResizingFrom, setIsResizingFrom] =
  createSignal<eResizingFrom | null>(null);

/**
 *
 * A bunch of state/store helpers
 *
 *
 */
export const unselectObjects = () => {
  // if any of the objects we're about to unselect are a text area, we need
  // to make that text area unfocused

  // const objs = objects;
  // selectedObjectIds().forEach((id) => {
  //   const obj = objs[id];
  //   if (obj && obj?.type === eObjectType.TEXT) {
  //     objs[id] = {
  //       ...obj,
  //       isFocused: false,
  //     };
  //   }
  // });
  // setObjects(objs);
  // setIsFocusedInTextbox(Object.values(objs).some((obj) => obj.isFocused));
  setSelectedObjectIds([]);
  setIsSelectingMultipleObjects(false);

  window.getSelection()!.removeAllRanges();
};

export const deleteSelectedObjects = () => {
  setObjects((objs) =>
    objs.filter((obj) => !selectedObjectIds().includes(obj.id))
  );
  unselectObjects();
};
