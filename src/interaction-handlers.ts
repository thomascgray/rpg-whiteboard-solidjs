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
import * as Store from "./store";
import * as ResizeUtils from "./utils/resize-utils";
import * as _ from "lodash";
import { reconcile } from "solid-js/store";

export const interactionPanCamera = (movementX: number, movementY: number) => {
  DOMUtils.stopCameraAnimating();

  const deltaX = movementX;
  const deltaY = movementY;

  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  window.__cameraDom!.style.transform = `scale(${z}) translate(${
    x - deltaX / z
  }px, ${y - deltaY / z}px)`;
};

export const interactionMoveObjects = (e: MouseEvent) => {
  if (!window.__app_selectedObjects) {
    return;
  }
  const camera = Store.camera();
  const mouseDownPosCanvas = Store.leftMouseDownPosCanvas();

  const mousePoint = Utils.screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z,
  );

  // move the elements themeslves, and work out the top-left most set of coords
  const xList: number[] = [];
  const yList: number[] = [];

  // we move all the selected objects
  for (let el of window.__app_selectedObjects) {
    const element = el as HTMLElement;

    // if (element.dataset.isBattleToken) {
    //   // const x = Number(element.dataset.posX) + e.movementX / Store.camera().z;
    //   // const y = Number(element.dataset.posY) + e.movementY / Store.camera().z;
    //   // xList.push(x);
    //   // yList.push(y);

    //   // Store.updateObject(element.id, {
    //   //   x: Number(element.dataset.posX) + e.movementX / Store.camera().z,
    //   //   y: Number(element.dataset.posY) + e.movementY / Store.camera().z,
    //   //   // width: Number(element.dataset.width) + 1,
    //   //   // height: Number(element.dataset.height),
    //   // });
    // } else {
    const x =
      Number(element.dataset.posX) + (mousePoint.x - mouseDownPosCanvas.x);
    const y =
      Number(element.dataset.posY) + (mousePoint.y - mouseDownPosCanvas.y);
    xList.push(x);
    yList.push(y);
    DOMUtils.setObjectPropertiesOnDom(element, { x, y });

    // we then do some specific mad bullshit for certain element types
    if (element.dataset.objectType === eObjectType.LINE_OF_SIGHT_WALL_ANCHOR) {
      // find any walls that have this anchor as either the start or end point, and update their relevant coords
      Store.objects
        .filter((o) => o.type === eObjectType.LINE_OF_SIGHT_WALL)
        .forEach((wall) => {
          if (wall.startAnchorId === element.id) {
            Store.updateObject(wall.id, {
              x: x + 10,
              y: y + 10,
            });
          }
          if (wall.endAnchorId === element.id) {
            Store.updateObject(wall.id, {
              wallEndPoint: {
                x: x + 10,
                y: y + 10,
              },
            });
          }
        });
    }
    // }
  }

  // TODO replace the various document.getElement stuff below with window accessors - we should just them
  // on the window so its faster

  // using the top-left most set of coords, move the selection box
  const objectSelectionBoxElement = document.getElementById(
    "__object-selection-highlight-box",
  );
  const minX = _.min(xList) as number;
  const minY = _.min(yList) as number;
  DOMUtils.setObjectPropertiesOnDom(objectSelectionBoxElement!, {
    x: minX,
    y: minY,
  });

  // also move the resize handles by the amount the mouse has moved
  const resizeHandles = document.getElementsByClassName("__resize-handle");
  for (let el of resizeHandles) {
    const resizeHandleElement = el as HTMLElement;
    const x =
      Number(resizeHandleElement.dataset.posX) +
      (mousePoint.x - mouseDownPosCanvas.x);
    const y =
      Number(resizeHandleElement.dataset.posY) +
      (mousePoint.y - mouseDownPosCanvas.y);
    DOMUtils.setObjectPropertiesOnDom(resizeHandleElement!, {
      x,
      y,
    });
  }

  // move the toolbar
  const selectedObjectsToolbar = document.getElementById(
    "__selected-objects-toolbar",
  );

  // const scale = Number(selectedObjectsToolbar!.dataset.scale);

  const x =
    Number(selectedObjectsToolbar!.dataset.posX) +
    (mousePoint.x - mouseDownPosCanvas.x) * Store.camera().z;
  const y =
    Number(selectedObjectsToolbar!.dataset.posY) +
    (mousePoint.y - mouseDownPosCanvas.y) * Store.camera().z;

  DOMUtils.setObjectPropertiesOnDom(selectedObjectsToolbar!, {
    scale: Number(selectedObjectsToolbar!.dataset.scale),
    x,
    y,
  });
};

export const interactionResizeObjects = (e: MouseEvent) => {
  const camera = Store.camera();
  const mouseDownPosCanvas = Store.leftMouseDownPosCanvas();

  const mousePoint = Utils.screenToCanvas(
    e.clientX,
    e.clientY,
    camera.x,
    camera.y,
    camera.z,
  );
  const diff = {
    x: mousePoint.x - mouseDownPosCanvas.x,
    y: mousePoint.y - mouseDownPosCanvas.y,
  };

  if (Store.isResizingFrom() === eResizingFrom.BOTTOM_LEFT) {
    ResizeUtils.resizeBottomLeftToTopRight(diff.x, diff.y);
  }

  if (Store.isResizingFrom() === eResizingFrom.BOTTOM_RIGHT) {
    ResizeUtils.resizeBottomRightToTopLeft(diff.x, diff.y);
  }

  if (Store.isResizingFrom() === eResizingFrom.MIDDLE_RIGHT) {
    ResizeUtils.resizeMiddleRight(diff.x, diff.y);
  }
};

export const interactionZoomCamera = (e: WheelEvent, isTrackpad: boolean) => {
  // we need to make this NOT happen for trackpads

  if (Math.sign(e.deltaY) === 1) {
    if (isTrackpad) {
      zoomCamera(e.clientX, e.clientY, 2);
    } else {
      zoomCamera(e.clientX, e.clientY, 10);
    }
  } else {
    if (isTrackpad) {
      zoomCamera(e.clientX, e.clientY, -2);
    } else {
      zoomCamera(e.clientX, e.clientY, -10);
    }
  }
};

export const zoomCamera = (xPos: number, yPos: number, distance: number) => {
  const [x, y, z] = DOMUtils.getCameraDomPosStyleValues();

  const newCamera = Utils.zoomCamera(
    x,
    y,
    z,
    { x: xPos, y: yPos },
    distance / 100,
  );

  window.__cameraDom!.style.scale = String(newCamera.z);
  (window.__cameraDom!.style.translate = String(newCamera.x)),
    String(newCamera.y);

  // i _think_ this is slow?
  // update the app zoom factor on the canvas
  window.__backgroundAppDom!.style.setProperty(
    "--app-camera-zoom",
    String(newCamera.z),
  );

  Store.setCamera(newCamera);
  window.__cameraDom!.dataset.posX = String(newCamera.x);
  window.__cameraDom!.dataset.posY = String(newCamera.y);
  window.__cameraDom!.dataset.posZ = String(newCamera.z);
};

export const mouseDownEmptySpace = () => {
  Store.unselectObjects();
  Store.setDragSelectionBox(null);
};

export const addingObjectsBasedOnSelectedTool = (e: MouseEvent) => {
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
    Store.selectedTool() === eTool.ADD_LOS_WALL_ANCHOR &&
    e.button === eMouseButton.LEFT
  ) {
    const pos = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z,
    );

    let addedWall: iObject | null = null;
    const lastWallAnchorAdded = Store.lastWallAnchorAdded();
    // ok, so, if we have a current wall anchor position, we need to also create a wall between this new point and the previous poiint
    if (Store.lastWallAnchorAdded() != null) {
      // console.log("Store.lastWallAnchorAdded()", Store.lastWallAnchorAdded());
      // also add a wall
      addedWall = Store.addNewObject({
        type: eObjectType.LINE_OF_SIGHT_WALL,
        x: Store.lastWallAnchorAdded()!.x + 10,
        y: Store.lastWallAnchorAdded()!.y + 10,
        wallEndPoint: {
          x: pos.x,
          y: pos.y,
        },
        width: Math.abs(pos.x - Store.lastWallAnchorAdded()!.x),
        height: Math.abs(pos.y - Store.lastWallAnchorAdded()!.y),
      });

      Store.updateObject(Store.lastWallAnchorAdded()!.id, {
        wallObjectIds: [
          ...(Store.lastWallAnchorAdded()!.wallObjectIds || []),
          addedWall.id,
        ],
      });
      // TODO update the last wall anchor added in the store to have the new all id
    }

    // then either way we add the new point
    const newAnchor = Store.addNewObject({
      type: eObjectType.LINE_OF_SIGHT_WALL_ANCHOR,
      x: pos.x - 10,
      y: pos.y - 10,
      height: 20,
      width: 20,
      wallObjectIds: addedWall ? [addedWall.id] : [],
    });
    Store.setLastWallAnchorAdded(newAnchor);

    if (addedWall) {
      Store.updateObject(addedWall.id, {
        startAnchorId: lastWallAnchorAdded!.id,
        endAnchorId: newAnchor.id,
      });
    }
  }

  if (
    Store.selectedTool() === eTool.ADD_LOS_LIGHT_SOURCE &&
    e.button === eMouseButton.LEFT
  ) {
    const pos = Utils.screenToCanvas(
      e.clientX,
      e.clientY,
      Store.camera().x,
      Store.camera().y,
      Store.camera().z,
    );

    Store.addNewObject({
      type: eObjectType.LINE_OF_SIGHT_LIGHT_SOURCE,
      x: pos.x,
      y: pos.y,
      width: 40,
      height: 40,
    });
  }
};
