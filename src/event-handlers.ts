import * as InteractionHandlers from "./interaction-handlers";
import * as Store from "./store";
import {
  eKey,
  eMouseButton,
  eResizingFrom,
  eTool,
  iCamera,
  iObject,
} from "./types";
import * as Utils from "./utils/general-utils";
import * as DOMUtils from "./utils/dom-utils";

export const onWindowMouseDown = (e: MouseEvent) => {
  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

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

  if (e.button === eMouseButton.LEFT || e.button === eMouseButton.MIDDLE) {
    Store.setMouseDownPos({ x: e.clientX, y: e.clientY });
    Store.setMouseDownPosCanvas(
      Utils.screenToCanvas(
        e.clientX,
        e.clientY,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z,
      ),
    );
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

  // if we're letting go of dragging a selection box
  if (
    e.button === eMouseButton.LEFT &&
    Store.isDrawingSelectionBox() &&
    Store.drawingSelectionBoxWidth() > 2 &&
    Store.drawingSelectionBoxHeight() > 2
  ) {
    // any objects that were within the bounding box of the drawing selection box need to be selected
    const objectsWithinSelectionBox = Object.values(Store.objects).filter(
      (obj) => {
        const selectionBox = {
          x: Store.drawingSelectionBoxStartPos().x,
          y: Store.drawingSelectionBoxStartPos().y,
          width: Store.drawingSelectionBoxWidth(),
          height: Store.drawingSelectionBoxHeight(),
        };

        return Utils.checkOverlap(obj, selectionBox);
      },
    );

    Store.setSelectedObjectIds(objectsWithinSelectionBox.map((obj) => obj.id));

    Store.setIsDrawingSelectionBox(false);
    Store.setDrawingSelectionBoxWidth(0);
    Store.setDrawingSelectionBoxHeight(0);
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
  if (Store.selectedTool() === eTool.SKETCH) {
    Store.setmousePosSketching({ x: e.clientX, y: e.clientY });
  }

  const selectedObjectDOMElements =
    DOMUtils.getAllCurrentlySelectedObjectDOMElements();

  // panning
  if (Store.heldMouseButtons().includes(eMouseButton.MIDDLE)) {
    InteractionHandlers.interactionPanCamera(-e.movementX, -e.movementY);
    return;
  }

  // mouse movement for drawing a selection box
  if (
    Store.selectedTool() === eTool.DEFAULT &&
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

    Store.setDrawingSelectionBoxStartPos({
      x: Math.min(mousePoint.x, Store.mouseDownPosCanvas().x),
      y: Math.min(mousePoint.y, Store.mouseDownPosCanvas().y),
    });

    Store.setDrawingSelectionBoxWidth(
      Math.abs(mousePoint.x - Store.mouseDownPosCanvas().x),
    );
    Store.setDrawingSelectionBoxHeight(
      Math.abs(mousePoint.y - Store.mouseDownPosCanvas().y),
    );
  }

  // mouse movement for moving objects around
  if (
    Store.selectedTool() === eTool.DEFAULT &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() === null &&
    !Store.isFocusedInTextbox()
  ) {
    // lol, do more of this i guess? [shrug]
    window.__app_selectedObjects =
      document.getElementsByClassName("__selected-object");
    InteractionHandlers.interactionMoveObjects(e);
    window.__app_selectedObjects = undefined;
  }

  // resizing object(s)
  if (
    Store.selectedTool() === eTool.DEFAULT &&
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() !== null &&
    !Store.isFocusedInTextbox()
  ) {
    window.__app_selectedObjects =
      document.getElementsByClassName("__selected-object");
    InteractionHandlers.interactionResizeObjects(e);
    window.__app_selectedObjects = undefined;
  }
};

export const onWindowMouseWheel = (e: WheelEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (e.ctrlKey) {
    InteractionHandlers.interactionZoomCamera(e);
  } else {
    InteractionHandlers.interactionPanCamera(e.deltaX, e.deltaY);
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
    Store.setIsDrawingSelectionBox(false);
    Store.setIsResizingFrom(null);
    Store.setSelectedObjectIds([]);
  }

  if (e.key === eKey.NUMBER_1) {
    Utils.sendSelectedObjectsToBack();
  }

  if (e.key === eKey.NUMBER_3) {
    Store.setSelectedTool(eTool.SKETCH);
  }
};

export const onWindowKeyUp = (e: KeyboardEvent) => {
  Store.setHeldKeys((keys) => keys.filter((k) => k !== (e.key as eKey)));
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
    Store.setIsDrawingSelectionBox(true);
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
  if (Store.selectedTool() === eTool.SKETCH) {
    return;
  }
  e.stopPropagation();

  // we've stopped propagation so, so we need to call this manually
  onWindowMouseDown(e);

  const selectedObjectIds = Store.selectedObjectIds();
  if (e.button === eMouseButton.LEFT) {
    // if the we've already selected the one we've clicked on, do nothing
    // this is so we can start a drag AFTER selecting multiple via shift select
    if (selectedObjectIds.includes(object.id)) {
      return;
    }

    // if we're not holding any other objects, just select it
    if (selectedObjectIds.length === 0) {
      Store.setSelectedObjectIds([object.id]);
      return;
    }

    // if we're not holding shift and we have some other objects, get
    // rid of those and only select the one we've clicked
    if (!Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds([object.id]);
      return;
    }

    // if we ARE holding shift, then add the selected one to the list
    if (Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds((selectedIds) => [...selectedIds, object.id]);
      return;
    }
  }
};
