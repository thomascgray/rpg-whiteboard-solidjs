import { createMemo, createSignal } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";

import {
  eKey,
  eLeftTray,
  eMouseButton,
  eObjectType,
  eResizingFrom,
  eTool,
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
export const [selectedObjectIds, setSelectedObjectIds] = createSignal<string[]>(
  [],
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
  { x: 0, y: 0 },
);

export const [isResizingFrom, setIsResizingFrom] =
  createSignal<eResizingFrom | null>(null);

export const [selectedTool, setSelectedTool] = createSignal<eTool>(
  eTool.DEFAULT,
);

export const [penColour, setPenColour] = createSignal<string>("#34495e");
export const [penSize, setPenSize] = createSignal<number>(50);

// this actually needs to be a "which tray on the left is open" cus theres gonna be more than 1
export const [openLeftTray, setOpenLeftTray] = createSignal<eLeftTray | null>(
  null,
);

export const [mousePosSketching, setmousePosSketching] = createSignal<iPoint>({
  x: 0,
  y: 0,
});

/**
 *
 *
 *
 *
 *
 *
 * A bunch of state/store helpers
 *
 *
 *
 *
 *
 *
 *
 */
export const unselectObjects = () => {
  // if any of the objects we're about to unselect are a text area, we need
  // to make that text area unfocused
  const objs = [...objects];

  // here we're actually setting ALL text objects to unfocused, but eh... thats fine? i think?
  objs.forEach((obj, i) => {
    if (obj.type === eObjectType.TEXT) {
      objs[i] = {
        ...obj,
        isFocused: false,
      };
    }
  });
  setSelectedObjectIds([]);
  setIsSelectingMultipleObjects(false);
  setObjects(reconcile(objs));

  window.getSelection()!.removeAllRanges();
};

// we do this in a helper because when we select objects
// we also want to store the bottom X position, etc.
// export const selectObjects = () => {};

export const deleteSelectedObjects = () => {
  setObjects((objs) =>
    objs.filter((obj) => !selectedObjectIds().includes(obj.id)),
  );
  unselectObjects();
};

export const addNewObject = (props: Partial<iObject>) => {
  const newObject: iObject = {
    id: Math.random().toString(),
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: objects.length + 1,
    type: eObjectType.IMAGE,
    isFocused: false,
    ...props,
  };
  setObjects((objs) => [...objs, newObject]);
  // setSelectedObjectIds([newObject.id]);
};
