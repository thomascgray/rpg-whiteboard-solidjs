import * as InteractionHandlers from "./interaction-handlers";
import * as Store from "./store";
import { eKey, eMouseButton, eResizingFrom, iCamera, iObject } from "./types";
import * as Utils from "./utils";
import * as DOMUtils from "./dom-utils";

export const onCoreMouseDown = (e: MouseEvent) => {
  Store.setHeldMouseButtons((buttons) => [...buttons, e.button]);

  if (e.button === eMouseButton.LEFT || e.button === eMouseButton.MIDDLE) {
    Store.setMouseDownPos({ x: e.clientX, y: e.clientY });
    Store.setMouseDownPosCanvas(
      Utils.screenToCanvas(
        e.clientX,
        e.clientY,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z
      )
    );
  }
};

export const onCoreMouseUp = (e: MouseEvent) => {
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
      }
    );

    Store.setSelectedObjectIds(objectsWithinSelectionBox.map((obj) => obj.id));
    Store.setIsSelectingMultipleObjects(objectsWithinSelectionBox.length > 1);

    Store.setIsDrawingSelectionBox(false);
    Store.setDrawingSelectionBoxWidth(0);
    Store.setDrawingSelectionBoxHeight(0);
  }

  // if we were panning
  if (e.button === eMouseButton.MIDDLE) {
    const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

    Store.setCamera({ x, y, z });
  }

  // // if we were just resizing
  if (e.button === eMouseButton.LEFT && Store.isResizingFrom() !== null) {
    Store.setIsResizingFrom(null);
    DOMUtils.persistSelectedObjectDOMElementsToState();
  }

  // finally, unset the held buttons
  Store.setHeldMouseButtons((buttons) => buttons.filter((b) => b !== e.button));
};

export const onCoreMouseMove = (e: MouseEvent) => {
  const selectedObjectDOMElements =
    DOMUtils.getAllCurrentlySelectedObjectDOMElements();

  // panning
  if (Store.heldMouseButtons().includes(eMouseButton.MIDDLE)) {
    InteractionHandlers.interactionPanCamera(e);
    return;
  }

  // mouse movement for drawing a selection box
  if (
    selectedObjectDOMElements.length <= 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT)
  ) {
    const mousePoint = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z
    );

    Store.setDrawingSelectionBoxStartPos({
      x: Math.min(mousePoint.x, Store.mouseDownPosCanvas().x),
      y: Math.min(mousePoint.y, Store.mouseDownPosCanvas().y),
    });

    Store.setDrawingSelectionBoxWidth(
      Math.abs(mousePoint.x - Store.mouseDownPosCanvas().x)
    );
    Store.setDrawingSelectionBoxHeight(
      Math.abs(mousePoint.y - Store.mouseDownPosCanvas().y)
    );
  }

  // mouse movement for moving objects around
  if (
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
    selectedObjectDOMElements.length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() !== null &&
    !Store.isFocusedInTextbox()
  ) {
    InteractionHandlers.interactionResizeObjects(e);
  }
};

export const onCoreMouseWheel = (e: WheelEvent) => {
  InteractionHandlers.interactionZoomCamera(e);
};

export const onCoreKeyDown = (e: KeyboardEvent) => {
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
    Store.setIsSelectingMultipleObjects(false);
    Store.setSelectedObjectIds([]);
  }

  if (e.key === eKey.NUMBER_1) {
    Utils.sendSelectedObjectsToBack();
  }
};

export const onCoreKeyUp = (e: KeyboardEvent) => {
  Store.setHeldKeys((keys) => keys.filter((k) => k !== (e.key as eKey)));
};

export const onCanvasMouseDown = (e: MouseEvent) => {
  if (e.button === eMouseButton.LEFT) {
    Store.unselectObjects();
    Store.setIsDrawingSelectionBox(true);
  }
};

export const onBeginResizing = (e: MouseEvent, resizingFrom: eResizingFrom) => {
  e.stopPropagation();
  // we've stopped propagation so, so we need to call this manually
  onCoreMouseDown(e);

  if (e.button === eMouseButton.LEFT) {
    Store.setIsResizingFrom(resizingFrom);
    // Store.setObjectSelectionBoxWidthPreResize(Store.objectSelectionBoxWidth());
    // Store.setObjectSelectionBoxHeightPreResize(
    //   Store.objectSelectionBoxHeight()
    // );
  }
};

export const onObjectMouseDown = (e: MouseEvent, object: iObject) => {
  e.stopPropagation();

  // we've stopped propagation so, so we need to call this manually
  onCoreMouseDown(e);

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
      Store.setIsSelectingMultipleObjects(false);
      return;
    }

    // if we're not holding shift and we have some other objects, get
    // rid of those and only select the one we've clicked
    if (!Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds([object.id]);
      Store.setIsSelectingMultipleObjects(false);
      return;
    }

    // if we ARE holding shift, then add the selected one to the list
    if (Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds((selectedIds) => [...selectedIds, object.id]);
      Store.setIsSelectingMultipleObjects(Store.selectedObjectIds().length > 1);
      return;
    }
  }
};
