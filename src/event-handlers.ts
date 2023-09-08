import * as InteractionHandlers from "./interaction-handlers";
import * as Store from "./store";
import {
  eKey,
  eMouseButton,
  eObjectType,
  eResizingFrom,
  eTool,
  iCamera,
  iObject,
} from "./types";
import * as Utils from "./utils/general-utils";
import * as DOMUtils from "./utils/dom-utils";

export const onWindowMouseDown = (e: MouseEvent) => {
  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  // todo work out why this is necessary, and make a real comment
  window.__cameraDom!.style.transform = `scale(${z}) translate(${x}px, ${y}px)`;

  // this isnt great because the camera will still be out at the _end_ of the drag
  Store.setCamera({
    x,
    y,
    z,
  });
  window.__cameraDom!.dataset.posX = String(x);
  window.__cameraDom!.dataset.posY = String(y);
  window.__cameraDom!.dataset.posZ = String(z);

  Store.setHeldMouseButtons((buttons) => [...buttons, e.button]);

  // if we click left mouse
  if (e.button === eMouseButton.LEFT) {
    // store the position of the mouse in canvas space
    Store.setLeftMouseDownPosCanvas(
      Utils.screenToCanvas(
        e.clientX,
        e.clientY,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z,
      ),
    );

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
    Store.selectedTool() === eTool.CURSOR &&
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
    Store.selectedTool() === eTool.CURSOR &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() === null &&
    Store.focusedObjectId() === null
  ) {
    InteractionHandlers.interactionMoveObjects(e);
  }

  // resizing object(s)
  if (
    Store.selectedTool() === eTool.CURSOR &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() !== null &&
    Store.focusedObjectId() === null
  ) {
    InteractionHandlers.interactionResizeObjects(e);
  }
};

export const onWindowMouseWheel = (e: WheelEvent) => {
  e.stopPropagation();
  e.preventDefault();
  const isTrackpad = Math.abs(e.deltaY) < 50;
  if (isTrackpad) {
    if (e.ctrlKey) {
      InteractionHandlers.interactionZoomCamera(e);
    } else {
      InteractionHandlers.interactionPanCamera(e.deltaX, e.deltaY);
    }
  } else {
    InteractionHandlers.interactionZoomCamera(e);
  }
};

export const onWindowKeyDown = (e: KeyboardEvent) => {
  if (e.repeat) {
    return;
  }
  Store.setHeldKeys((keys) => [...keys, e.key as eKey]);

  if (e.key === eKey.DELETE) {
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
    Store.selectedTool() === eTool.ADD_LINE_OF_SIGHT_WALL &&
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

/**
 * DOM handlers
 */

export const onCanvasMouseDown = (e: MouseEvent) => {
  if (Store.selectedTool() === eTool.SKETCH) {
    return;
  }
  if (e.button === eMouseButton.LEFT) {
    Store.unselectObjects();
    Store.setDragSelectionBox(null);
  }

  if (Store.selectedTool() === eTool.ADD_INFO_PIN) {
    const pos = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z,
    );

    Store.addNewObject({
      type: eObjectType.INFO_PIN,
      x: pos.x,
      y: pos.y,
    });
  }

  if (
    Store.selectedTool() === eTool.ADD_LINE_OF_SIGHT_WALL &&
    e.button === eMouseButton.LEFT
  ) {
    const pos = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z,
    );

    // ok, so, if we have a current wall anchor position, we need to also create a wall between this new point and the previous poiint
    if (Store.lastWallAnchorAdded() != null) {
      console.log("Store.lastWallAnchorAdded()", Store.lastWallAnchorAdded());
      // also add a wall
      Store.addNewObject({
        type: eObjectType.LINE_OF_SIGHT_WALL,
        x: Store.lastWallAnchorAdded()!.x,
        y: Store.lastWallAnchorAdded()!.y,
        wallEndPoint: {
          x: pos.x,
          y: pos.y,
        },
        width: Math.abs(pos.x - Store.lastWallAnchorAdded()!.x),
        height: Math.abs(pos.y - Store.lastWallAnchorAdded()!.y),
      });
    }

    // then either way we add the new point
    const no = Store.addNewObject({
      type: eObjectType.LINE_OF_SIGHT_WALL_ANCHOR,
      x: pos.x - 10,
      y: pos.y - 10,
      height: 20,
      width: 20,
    });
    Store.setLastWallAnchorAdded(no);

    // and update the last wall anchor added to the new point
  }
};

export const onBeginResizing = (e: MouseEvent, resizingFrom: eResizingFrom) => {
  e.stopPropagation();
  // we've stopped propagation so, so we need to call this manually
  onWindowMouseDown(e);

  if (e.button === eMouseButton.LEFT) {
    Store.setIsResizingFrom(resizingFrom);
  }
};

export const onObjectMouseDown = (e: MouseEvent, object: iObject) => {
  // if (Store.selectedTool() === eTool.SKETCH) {
  //   return;
  // }
  e.stopPropagation();

  // we've stopped propagation so, so we need to call this manually
  onWindowMouseDown(e);

  if (Store.selectedTool() === eTool.CURSOR) {
    const selectedObjectIds = Store.selectedObjectIds();
    if (e.button === eMouseButton.LEFT) {
      // if the we've already selected the one we've clicked on, do nothing
      // this is so we can start a drag
      if (selectedObjectIds.includes(object.id)) {
        return;
      }

      // if we're not holding any other objects, just select it
      if (selectedObjectIds.length === 0) {
        Store.setSelectedObjectIds([object.id]);
        window.__app_selectedObjects = document.querySelectorAll(
          ".__selected-object:not(.__is-locked)",
        );
        return;
      }

      // if we're not holding shift and we have some other objects, get
      // rid of those and only select the one we've clicked
      if (!Store.heldKeys().includes(eKey.SHIFT)) {
        Store.setSelectedObjectIds([object.id]);
        window.__app_selectedObjects = document.querySelectorAll(
          ".__selected-object:not(.__is-locked)",
        );
        return;
      }

      // if we ARE holding shift, then add the selected one to the list
      if (Store.heldKeys().includes(eKey.SHIFT) && !object.isLocked) {
        Store.setSelectedObjectIds((selectedIds) => [
          ...selectedIds,
          object.id,
        ]);
        window.__app_selectedObjects = document.querySelectorAll(
          ".__selected-object:not(.__is-locked)",
        );
        return;
      }
    }
  }
};
