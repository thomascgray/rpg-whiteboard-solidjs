import * as InteractionHandlers from "./interaction-handlers";
import * as Store from "./store";
import { eKey, eMouseButton, eResizingFrom, iObject } from "./types";
import { checkOverlap, screenToCanvas, zoomCamera } from "./utils";

export const onMouseDown_Window = (e: MouseEvent) => {
  Store.setHeldMouseButtons((buttons) => [...buttons, e.button]);

  if (e.button === eMouseButton.LEFT) {
    Store.setMouseDownPos({ x: e.clientX, y: e.clientY });
    Store.setMouseDownPosCanvas(
      screenToCanvas(
        e.clientX,
        e.clientY,
        Store.camera().x,
        Store.camera().y,
        Store.camera().z
      )
    );
  }

  if (e.button === eMouseButton.MIDDLE) {
    Store.setIsPanning(true);
  }
};

export const onMouseUp_Window = (e: MouseEvent) => {
  // // if we got some selected objects and we were just dragging them around, set
  // // those objects to their new positions
  if (e.button === eMouseButton.LEFT && Store.selectedObjectIds().length > 0) {
    Store.selectedObjectIds().forEach((id) => {
      const obj = Store.objects[id];
      Store.setObjects(id, {
        preDragPos: obj.pos,
        preResizePos: obj.pos,
      });
    });
  }

  // // if we're letting go of dragging a selection box
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
          pos: {
            x: Store.drawingSelectionBoxStartPos().x,
            y: Store.drawingSelectionBoxStartPos().y,
          },
          dimensions: {
            width: Store.drawingSelectionBoxWidth(),
            height: Store.drawingSelectionBoxHeight(),
          },
        };

        return checkOverlap(obj, selectionBox);
      }
    );

    Store.setSelectedObjectIds(objectsWithinSelectionBox.map((obj) => obj.id));
    Store.recalculateObjectSelectionBoxPos();
    Store.recalculateObjectSelectionBoxWidthAndHeight();
    Store.setIsSelectingMultipleObjects(objectsWithinSelectionBox.length > 1);

    Store.setIsDrawingSelectionBox(false);
    Store.setDrawingSelectionBoxWidth(0);
    Store.setDrawingSelectionBoxHeight(0);
  }

  // // if we were just resizing, we're not anymore
  if (e.button === eMouseButton.LEFT && Store.isResizingFrom() !== null) {
    Store.selectedObjectIds().forEach((id) => {
      const obj = Store.objects[id];
      Store.setObjects(id, {
        preResizeDimensions: obj.dimensions,
        preResizePos: obj.pos,
      });
    });
    Store.setObjectSelectionBoxWidthPreResize(Store.objectSelectionBoxWidth());
    Store.setObjectSelectionBoxHeightPreResize(
      Store.objectSelectionBoxHeight()
    );
    Store.setIsResizingFrom(null);
  }

  // finally, unset the held buttons
  Store.setHeldMouseButtons((buttons) => buttons.filter((b) => b !== e.button));
};

export const onMouseMove_Window = (e: MouseEvent) => {
  // mouse movement for drawing a selection box
  if (
    Store.selectedObjectIds().length <= 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT)
  ) {
    const mousePoint = screenToCanvas(
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

    // Store.setDrawingSelectionBoxStartPos.y = Math.min(mousePoint.y, state.mouseDownPosCanvas.y);
    Store.setDrawingSelectionBoxWidth(
      Math.abs(mousePoint.x - Store.mouseDownPosCanvas().x)
    );
    Store.setDrawingSelectionBoxHeight(
      Math.abs(mousePoint.y - Store.mouseDownPosCanvas().y)
    );
  }

  // mouse movement for moving objects around
  if (
    Store.selectedObjectIds().length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() === null &&
    !Store.isFocusedInTextbox()
  ) {
    InteractionHandlers.interactionMoveObjects(e);
  }

  // resizing
  if (
    Store.selectedObjectIds().length > 0 &&
    Store.heldMouseButtons().includes(eMouseButton.LEFT) &&
    Store.isResizingFrom() !== null &&
    !Store.isFocusedInTextbox()
  ) {
    InteractionHandlers.interactionResizeObjects(e);
  }

  if (Store.heldMouseButtons().includes(eMouseButton.MIDDLE)) {
    InteractionHandlers.interactionPanCamera(e.movementX, e.movementY);
  }
};

export const onMouseWheel_Window = (e: WheelEvent) => {
  let scrollValue = e.deltaY;
  if (Math.abs(e.deltaY) === 100) {
    scrollValue = scrollValue * 0.1;
  }
  if (scrollValue > 30) {
    scrollValue = 30;
  } else if (scrollValue < -30) {
    scrollValue = -30;
  }

  Store.setCamera((camera) =>
    zoomCamera(camera, { x: e.clientX, y: e.clientY }, scrollValue / 100)
  );
};

export const onKeyDown_Window = (e: KeyboardEvent) => {
  if (e.repeat) {
    return;
  }
  Store.setHeldKeys((keys) => [...keys, e.key as eKey]);
};

export const onKeyUp_Window = (e: KeyboardEvent) => {
  Store.setHeldKeys((keys) => keys.filter((k) => k !== (e.key as eKey)));
};

export const onCanvasMouseDown = (e: MouseEvent) => {
  console.log("onCanvasMouseDown");
  if (e.button === eMouseButton.LEFT) {
    Store.unselectObjects();
    Store.setIsDrawingSelectionBox(true);
  }
};

export const onBeginResizing = (e: MouseEvent, resizingFrom: eResizingFrom) => {
  console.log("onBeginResizing");

  e.stopPropagation();
  // we've stopped propagation so, so we need to call this manually
  onMouseDown_Window(e);

  if (e.button === eMouseButton.LEFT) {
    Store.setIsResizingFrom(resizingFrom);
    Store.setObjectSelectionBoxWidthPreResize(Store.objectSelectionBoxWidth());
    Store.setObjectSelectionBoxHeightPreResize(
      Store.objectSelectionBoxHeight()
    );
  }
};

export const onObjectMouseDown = (e: MouseEvent, object: iObject) => {
  e.stopPropagation();

  // we've stopped propagation so, so we need to call this manually
  onMouseDown_Window(e);

  const selectedObjectIds = Store.selectedObjectIds();
  if (e.button === eMouseButton.LEFT) {
    // if the we've already selected the one we've clicked on, do nothing
    // this is so we can start a drag AFTER selecting multiple via shift select
    if (selectedObjectIds.includes(object.id)) {
      return;
    }

    // if we're not holding any other objects, just select it
    if (selectedObjectIds.length === 0) {
      // selectedObjectIds = [object.id];
      Store.setSelectedObjectIds([object.id]);
      Store.recalculateObjectSelectionBoxPos();
      Store.recalculateObjectSelectionBoxWidthAndHeight();
      Store.setIsSelectingMultipleObjects(false);
      return;
    }

    // if we're not holding shift and we have some other objects, get
    // rid of those and only select the one we've clicked
    if (!Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds([object.id]);
      Store.recalculateObjectSelectionBoxPos();
      Store.recalculateObjectSelectionBoxWidthAndHeight();
      Store.setIsSelectingMultipleObjects(false);
      // selectedObjectIds = [object.id];
      // state.isSelectingMultipleObjects = selectedObjectIds.length > 1;
      return;
    }

    // if we ARE holding shift, then add the selected one to the list
    if (Store.heldKeys().includes(eKey.SHIFT)) {
      Store.setSelectedObjectIds((selectedIds) => [...selectedIds, object.id]);
      Store.recalculateObjectSelectionBoxPos();
      Store.recalculateObjectSelectionBoxWidthAndHeight();
      Store.setIsSelectingMultipleObjects(Store.selectedObjectIds().length > 1);
      return;
    }
  }
};
