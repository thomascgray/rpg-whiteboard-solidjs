import * as InteractionHandlers from "./interaction-handlers";
import * as Store from "./store";
import {
  eKey,
  eLineOfSightTools,
  eMouseButton,
  eObjectType,
  eResizingFrom,
  eTool,
  iCamera,
  iObject,
} from "./types";
import * as Utils from "./utils/general-utils";
import * as DOMUtils from "./utils/dom-utils";
import * as Config from "./config";

export const onWindowMouseDown = (e: MouseEvent) => {
  Store.setHeldMouseButtons((buttons) => [...buttons, e.button]);

  // store the mouse position in canvas space based on the pressed button
  switch (e.button) {
    case eMouseButton.LEFT:
      Store.setLeftMouseDownPosCanvas(
        Utils.screenToCanvas(
          e.clientX,
          e.clientY,
          Store.camera().x,
          Store.camera().y,
          Store.camera().z,
        ),
      );
      break;
    case eMouseButton.RIGHT:
      Store.setRightMouseDownPosCanvas(
        Utils.screenToCanvas(
          e.clientX,
          e.clientY,
          Store.camera().x,
          Store.camera().y,
          Store.camera().z,
        ),
      );
      break;
  }

  // first of all, unless i can think of a better reason why, if we've just clicked
  // on an element of UI, don't do anything
  if (e.target) {
    if ((e.target as HTMLElement).closest(`.${Config.UI_CLASS}`)) {
      return;
    }
  }

  // todo this function should also be able to handle
  // clicking on objects, resize handles, etc.
  // if we click left mouse

  if (e.button === eMouseButton.LEFT) {
    // store the position of the mouse in canvas space
    Store.setRightMouseDownPosCanvas(null);

    const elements = Array.from(document.querySelectorAll(":hover"));

    // if we've clicked on the background
    if (
      elements.at(-1)?.id === Config.APP_BACKGROUND_DOM_ID ||
      elements.at(-1)?.id === Config.APP_CAMERA_DOM_ID
    ) {
      InteractionHandlers.leftMouseDownEmptySpace();
    }

    if (
      elements.at(-1)?.id === "line-of-sight-walls-svg-wrapper" &&
      Store.selectedTool() === eTool.LINE_OF_SIGHT &&
      Store.selectedLineOfSightTool() === eLineOfSightTools.LOS_CURSOR
    ) {
      InteractionHandlers.leftMouseDownEmptySpace();
    }

    // if we've clicked on an object, do some object stuff
    if (elements.at(-1)?.classList.contains(Config.OBJECT_CLASS)) {
      // get the object by its element id
      const object = Store.objects.find((o) => o.id === elements.at(-1)!.id);
      if (!object) {
        return;
      }
      InteractionHandlers.interactionLeftMouseDownOnObject(e, object);
    }

    // maybe we're adding an item, based on the tool
    InteractionHandlers.addingObjectsBasedOnSelectedTool(e);

    //... AND if we're measuring, start measuring tool
    if (Store.selectedTool() === eTool.MEASURING) {
      Store.setIsMeasuringDistance(true);
      Store.setMousePosMeasuringDistance(
        Utils.screenToCanvas(
          window.__mousePosition!.x,
          window.__mousePosition!.y,
          Store.camera().x,
          Store.camera().y,
          Store.camera().z,
        ),
      );
      Store.setTabKeyMouseDownPosCanvas(
        Utils.screenToCanvas(
          e.clientX,
          e.clientY,
          Store.camera().x,
          Store.camera().y,
          Store.camera().z,
        ),
      );
    }
  }
  if (e.button === eMouseButton.RIGHT) {
    console.log("aaaaaa right click");
  }
};

export const onWindowMouseUp = (e: MouseEvent) => {
  // if we were just dragging some objects around
  if (
    e.button === eMouseButton.LEFT &&
    Store.selectedObjectIds().length > 0 &&
    Store.isResizingFrom() === null
  ) {
    DOMUtils.persistSelectedObjectDOMElementsToState();
  }

  // if we're measuring distance
  if (e.button === eMouseButton.LEFT && Store.isMeasuringDistance()) {
    Store.setIsMeasuringDistance(false);
  }

  // if we're letting go of dragging a selection box
  if (e.button === eMouseButton.LEFT && Store.dragSelectionBox() !== null) {
    const currentSelectionBox = Store.dragSelectionBox()!;
    // any objects that were within the bounding box of the drawing selection box need to be selected
    const objectsWithinSelectionBox = Object.values(Store.objects)
      .filter((o) => !o.isLocked)
      .filter((o) => o.type !== eObjectType.LINE_OF_SIGHT_WALL)
      .filter((obj) => {
        const selectionBox = {
          x: currentSelectionBox.x,
          y: currentSelectionBox.y,
          width: currentSelectionBox.width,
          height: currentSelectionBox.height,
        };

        return Utils.checkOverlap(obj, selectionBox);
      });

    Store.setSelectedObjectIds(objectsWithinSelectionBox.map((obj) => obj.id));
    Store.setDragSelectionBox(null);
    window.__app_selectedObjects = document.querySelectorAll(
      ".__selected-object:not(.__is-locked)",
    );
  }

  // if we were panning
  if (e.button === eMouseButton.MIDDLE) {
    const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

    Store.setCamera({ x, y, z });
    window.__cameraDom!.dataset.posX = String(x);
    window.__cameraDom!.dataset.posY = String(y);
    window.__cameraDom!.dataset.posZ = String(z);
  }

  // // if we were just resizing
  if (e.button === eMouseButton.LEFT && Store.isResizingFrom() !== null) {
    Store.setIsResizingFrom(null);
    DOMUtils.persistSelectedObjectDOMElementsToState();
  }

  // finally, unset the held buttons
  Store.setHeldMouseButtons((buttons) => buttons.filter((b) => b !== e.button));
};

export const onWindowMouseMove = (e: MouseEvent) => {
  window.__mousePosition = { x: e.clientX, y: e.clientY };
  if (Store.isMeasuringDistance()) {
    Store.setMousePosMeasuringDistance(
      Utils.screenToCanvas(
        e.clientX,
        e.clientY,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z,
      ),
    );
  }

  if (Store.selectedTool() === eTool.SKETCH) {
    Store.setmousePosSketching({ x: e.clientX, y: e.clientY });
  }

  // panning
  if (Store.heldMouseButtons().includes(eMouseButton.MIDDLE)) {
    InteractionHandlers.interactionPanCamera(-e.movementX, -e.movementY);
    return;
  }

  const selectedObjectDOMElements =
    document.getElementsByClassName("__selected-object");

  // mouse movement for drawing a selection box
  if (
    Store.isCursorToolSelected() &&
    selectedObjectDOMElements.length <= 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT)
  ) {
    const mousePoint = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z,
    );

    Store.setDragSelectionBox({
      x: Math.min(mousePoint.x, Store.leftMouseDownPosCanvas().x),
      y: Math.min(mousePoint.y, Store.leftMouseDownPosCanvas().y),
      width: Math.abs(mousePoint.x - Store.leftMouseDownPosCanvas().x),
      height: Math.abs(mousePoint.y - Store.leftMouseDownPosCanvas().y),
    });
  }

  // mouse movement for moving objects around
  if (
    Store.isCursorToolSelected() &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() === null &&
    Store.focusedObjectId() === null
  ) {
    InteractionHandlers.interactionMoveObjects(e);
  }

  // resizing object(s)
  if (
    Store.isCursorToolSelected() &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() !== null &&
    Store.focusedObjectId() === null
  ) {
    InteractionHandlers.interactionResizeObjects(e);
  }
};

let x: NodeJS.Timeout | null = null;
export const onWindowMouseWheel = (e: WheelEvent) => {
  e.stopPropagation();
  e.preventDefault();
  const isTrackpad = Math.abs(e.deltaY) < 50;

  if (isTrackpad) {
    if (e.ctrlKey) {
      InteractionHandlers.interactionZoomCamera(e, isTrackpad);
    } else {
      InteractionHandlers.interactionPanCamera(e.deltaX, e.deltaY);
    }
    if (x) {
      window.clearInterval(x);
    }

    x = setTimeout(() => {
      const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

      Store.setCamera({ x, y, z });
      window.__cameraDom!.dataset.posX = String(x);
      window.__cameraDom!.dataset.posY = String(y);
      window.__cameraDom!.dataset.posZ = String(z);
    }, 100);
  } else {
    InteractionHandlers.interactionZoomCamera(e, isTrackpad);
  }
};

export const onWindowKeyDown = (e: KeyboardEvent) => {
  if (e.repeat) {
    return;
  }
  Store.setHeldKeys((keys) => [...keys, e.key as eKey]);

  if (
    Store.selectedObjectIds().length >= 1 &&
    (e.key === eKey.DELETE || e.key === eKey.BACKSPACE)
  ) {
    Store.deleteSelectedObjects();
  }

  if (e.key === eKey.ESCAPE) {
    Store.setDragSelectionBox(null);
    Store.setIsResizingFrom(null);
    Store.setSelectedObjectIds([]);
    window.__app_selectedObjects = document.querySelectorAll(
      ".__selected-object:not(.__is-locked)",
    );
  }

  if (
    Store.selectedTool() === eTool.LINE_OF_SIGHT &&
    Store.selectedLineOfSightTool() === eLineOfSightTools.LOS_ADD_WALL_ANCHOR &&
    e.key === eKey.SPACE
  ) {
    Store.setLastWallAnchorAdded(null);
  }

  if (e.key === "m" || e.key === "M") {
    e.preventDefault();
    e.stopPropagation();
    Store.setIsMeasuringDistance(true);
    Store.setTabKeyMouseDownPosCanvas(
      Utils.screenToCanvas(
        window.__mousePosition!.x,
        window.__mousePosition!.y,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z,
      ),
    );
    Store.setMousePosMeasuringDistance(
      Utils.screenToCanvas(
        window.__mousePosition!.x,
        window.__mousePosition!.y,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z,
      ),
    );
  }
};

export const onWindowKeyUp = (e: KeyboardEvent) => {
  Store.setHeldKeys((keys) => keys.filter((k) => k !== (e.key as eKey)));

  if (e.key === "m" || e.key === "M") {
    e.preventDefault();
    e.stopPropagation();
    Store.setIsMeasuringDistance(false);
  }
};

export const onWindowTouchEnd = (e: TouchEvent) => {
  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  Store.setCamera({ x, y, z });
  window.__cameraDom!.dataset.posX = String(x);
  window.__cameraDom!.dataset.posY = String(y);
  window.__cameraDom!.dataset.posZ = String(z);
};

export const onWindowContextMenu = (e: MouseEvent) => {
  if (Store.heldKeys().includes(eKey.CONTROL)) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
};

/**
 * DOM handlers
 */

export const onBeginResizing = (e: MouseEvent, resizingFrom: eResizingFrom) => {
  e.stopPropagation();
  // we've stopped propagation so, so we need to call this manually
  onWindowMouseDown(e);

  if (e.button === eMouseButton.LEFT) {
    Store.setIsResizingFrom(resizingFrom);
  }
};
