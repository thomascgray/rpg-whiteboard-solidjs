import { createMemo, createSignal } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";

import {
  eKey,
  eLeftTray,
  eLineOfSightTools,
  eMeasuringTools,
  eModalTypes,
  eMouseButton,
  eObjectType,
  eResizingFrom,
  eTool,
  iBoardSettings,
  iBox,
  iCamera,
  iObject,
  iPoint,
} from "./types";
import { nanoid } from "nanoid";

/**
 * OK, so;
 *
 * Every piece of state is its own signal. This is so that when we update
 * a single piece of it, only the components that are using that piece of state update.
 *
 * The best way to use the store is to do something like:
 *      `import * as Store from '../store';`
 * at the top of your file, and then give it an ol'
 *      Store.heldKeys();
 * inside the file
 *
 * Thanks to SolidJS black magic, it means we can turn _any_ random bit of code in the app into a "reactive"
 * bit of code, by simply using a signal.
 */

// 1. all the objects are in a big map, as are the board settings
export const [objects, setObjects] = createStore<iObject[]>([]);
export const [boardSettings, setBoardSettings] = createStore<iBoardSettings>({
  boardBackgroundColour: "#fff",
});

// 2. we have the keyboard and mouse buttons that the user is pressing
export const [heldMouseButtons, setHeldMouseButtons] = createSignal<
  eMouseButton[]
>([]);
export const [heldKeys, setHeldKeys] = createSignal<eKey[]>([]);

// 3. everything else is basically "interaction" state. e.g what objects are selected, is the user dragging, etc.
export const [camera, setCamera] = createSignal<iCamera>({
  x: 0,
  y: 0,
  z: 1,
});

export const [selectedObjectIds, setSelectedObjectIds] = createSignal<string[]>(
  [],
);

export const [focusedObjectId, setFocusedObjectId] = createSignal<
  string | null
>(null);

export const [dragSelectionBox, setDragSelectionBox] =
  createSignal<iBox | null>(null);

export const [leftMouseDownPosCanvas, setLeftMouseDownPosCanvas] =
  createSignal<iPoint>({ x: 0, y: 0 });

export const [tabKeyMouseDownPosCanvas, setTabKeyMouseDownPosCanvas] =
  createSignal<iPoint>({ x: 0, y: 0 });

export const [isResizingFrom, setIsResizingFrom] =
  createSignal<eResizingFrom | null>(null);

export const [selectedTool, setSelectedTool] = createSignal<eTool>(
  eTool.CURSOR,
);

export const [selectedMeasuringTool, setSelectedMeasuringTool] =
  createSignal<eMeasuringTools>(eMeasuringTools.LINE);

export const [selectedLineOfSightTool, setSelectedLineOfSightTool] =
  createSignal<eLineOfSightTools>(eLineOfSightTools.LOS_CURSOR);

export const [penColour, setPenColour] = createSignal<string>("#e74c3c");
export const [penSize, setPenSize] = createSignal<number>(10);

// this actually needs to be a "which tray on the left is open" cus theres gonna be more than 1
export const [openLeftTray, setOpenLeftTray] = createSignal<eLeftTray | null>(
  null,
);

export const [mousePosSketching, setmousePosSketching] = createSignal<iPoint>({
  x: 0,
  y: 0,
});

export const [objectSelectionBox, setObjectSelectionBox] =
  createSignal<iBox | null>(null);

export const [currentModal, setCurrentModal] = createSignal<eModalTypes | null>(
  null,
);

export const [isMeasuringDistance, setIsMeasuringDistance] =
  createSignal<boolean>(false);

// how many pixels it is for 1 square across
export const [measuringScale, setMeasuringScale] = createSignal<number>(0);

export const [mousePosMeasuringDistance, setMousePosMeasuringDistance] =
  createSignal<iPoint>({
    x: 0,
    y: 0,
  });

export const [lastWallAnchorAdded, setLastWallAnchorAdded] =
  createSignal<iObject | null>(null);

export const [rightMouseDownPosCanvas, setRightMouseDownPosCanvas] =
  createSignal<iPoint | null>(null);

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

export const isCursorToolSelected = () => {
  return (
    selectedTool() === eTool.CURSOR ||
    (selectedTool() === eTool.LINE_OF_SIGHT &&
      selectedLineOfSightTool() === eLineOfSightTools.LOS_CURSOR)
  );
};

export const unselectObjects = () => {
  // if any of the objects we're about to unselect are a text area, we need
  // to make that text area unfocused
  // const objs = [...objects];

  setFocusedObjectId(null);
  setSelectedObjectIds([]);
  // setObjects(reconcile(objs));

  // window.getSelection()!.removeAllRanges();
};

export const deleteSelectedObjects = () => {
  const ids = [...selectedObjectIds()];
  unselectObjects();
  deleteObjectsById(ids);
};

export const deleteObjectsById = (ids: string[]) => {
  let idsToDelete = [...ids];
  unselectObjects();
  // if the thing we're deleting
  ids.forEach((id) => {
    const obj = objects.find((obj) => obj.id === id);
    if (obj && obj.type === eObjectType.LINE_OF_SIGHT_WALL_ANCHOR) {
      // if we're deleting a wall anchor, we need to delete the wall too
      idsToDelete = [...idsToDelete, ...(obj.wallObjectIds || [])];
    }
  });

  // also, if we have any wall anchors whose ALL walls are being deleted, we need to delete those too
  objects
    .filter((obj) => obj.type === eObjectType.LINE_OF_SIGHT_WALL_ANCHOR)
    .forEach((obj) => {
      if (obj.wallObjectIds?.every((id) => idsToDelete.includes(id))) {
        console.log("obj.id", obj.id);
        idsToDelete = [...idsToDelete, obj.id];
      }
    });

  setObjects((objs) => objs.filter((obj) => !idsToDelete.includes(obj.id)));
};

export const addNewObject = (props: Partial<iObject>) => {
  const newObject: iObject = {
    id: nanoid(),
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: objects.length + 1,
    type: eObjectType.IMAGE,
    isLocked: false,
    ...props,
  };
  setObjects((objs) => [...objs, newObject]);
  return newObject;
};

/**
 * get a property from the first selected object
 *
 * useful for the selected object toolbars
 * @param property
 * @returns
 */
export const so1_prop = (property: keyof iObject) => {
  return objects.find((obj) => obj.id === selectedObjectIds()[0])?.[property];
};

/**
 * return true if every selected object has the same value for a property
 *
 * useful for the selected object toolbars
 * @param property
 * @returns
 */
// export const so_every = (property: keyof iObject, value: any) => {
//   console.log("so_every");
//   return selectedObjectIds().every(
//     (id) => objects.find((obj) => obj.id === id)?.[property] === value,
//   );
// };

/**
 * set a property value against all the selected objects at once.
 *
 * useful for setting values from toolbars
 * @param property
 * @param value
 */
export const so_prop_set = (property: keyof iObject, value: any) => {
  const objs = [...objects];
  selectedObjectIds().forEach((id) => {
    const obj = objects.find((obj) => obj.id === id);
    if (obj === undefined) return;
    const objIndex = objects.findIndex((obj) => obj.id === id);
    objs[objIndex] = {
      ...obj,
      [property]: value,
    };
  });
  setObjects(reconcile(objs));
};

export const updateObject = (id: string, props: Partial<iObject>) => {
  const objs = [...objects];
  const obj = objects.find((obj) => obj.id === id);
  if (obj === undefined) return;
  const objIndex = objects.findIndex((obj) => obj.id === id);
  objs[objIndex] = {
    ...obj,
    ...props,
  };
  setObjects(reconcile(objs));
};

export const getAllObjectsOnScreen = () => {
  // const objectsOnScreen: iObject[] = [];
  // for (let obj of objects) {
  //   if
  // }
};
