import { Component, createMemo, createEffect, onMount, Show } from "solid-js";
import * as Store from "../../store";
import { eObjectType, eResizingFrom, iPoint } from "../../types";
import * as EventHandlers from "../../event-handlers";

const HANDLE_SIZE = 15;
const HANDLE_SIZE_HALF = HANDLE_SIZE / 2;

export const ResizeHandles: Component = (props) => {
  const isSelectingSingleTextarea = createMemo(() => {
    if (Store.selectedObjectIds().length === 1) {
      const index = Store.objects.findIndex(
        (o) => o.id === Store.selectedObjectIds()[0],
      );
      return Store.objects[index].type === eObjectType.TEXT;
    }
    return false;
  });

  // work out the bottom left and bottom right most points of all the selected objects
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id),
    );
  });

  const bottomLeftPoint = createMemo(() => {
    if (Store.objectSelectionBox() === null) {
      return { x: 0, y: 0 };
    }
    return {
      x: Store.objectSelectionBox()!.x,
      y: Store.objectSelectionBox()!.y,
    };
  });
  const bottomRightPoint = createMemo(() => {
    if (Store.objectSelectionBox() === null) {
      return { x: 0, y: 0 };
    }
    return {
      x: Store.objectSelectionBox()!.x + Store.objectSelectionBox()!.width,
      y: Store.objectSelectionBox()!.y + Store.objectSelectionBox()!.height,
    };
  });

  return (
    <>
      {/* bottom left */}
      <div
        id="__resize_handle_bottom_left"
        data-pos-x={bottomLeftPoint().x}
        data-pos-y={bottomLeftPoint().y}
        onMouseDown={(e) => {
          EventHandlers.onBeginResizing(e, eResizingFrom.BOTTOM_LEFT);
        }}
        style={`
        width: calc(${HANDLE_SIZE}px / var(--app-camera-zoom)); 
        height: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        outline-width: calc(3px / var(--app-camera-zoom));
        left: calc(-${HANDLE_SIZE * 2}px / var(--app-camera-zoom));
        top: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        transform: translate(${bottomLeftPoint().x}px, ${
          bottomLeftPoint().y
        }px)`}
        class="__resize-handle invisible absolute z-[99999999] cursor-sw-resize rounded-full bg-white outline outline-blue-400"
      ></div>

      {/* bottom right */}
      <div
        id="__resize_handle_bottom_right"
        data-pos-x={bottomRightPoint().x}
        data-pos-y={bottomRightPoint().y}
        onMouseDown={(e) => {
          EventHandlers.onBeginResizing(e, eResizingFrom.BOTTOM_RIGHT);
        }}
        style={`
        width:  calc(${HANDLE_SIZE}px / var(--app-camera-zoom)); 
        height: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        left: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        top: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));

        outline-width: calc(3px / var(--app-camera-zoom));
        transform: translate(${bottomRightPoint().x}px, ${
          bottomRightPoint().y
        }px)`}
        class="__resize-handle absolute top-0 z-[99999999] cursor-se-resize rounded-full bg-white outline outline-blue-400"
      ></div>

      {/* right (for text boxes and other direct width editors) */}
      <Show when={isSelectingSingleTextarea()}>
        <div
          id="__resize_handle_middle_right"
          data-pos-x={bottomRightPoint().x}
          data-pos-y={
            bottomRightPoint().y -
            selectedObjects()[0].height / 2 -
            HANDLE_SIZE_HALF -
            HANDLE_SIZE / Store.camera().z
          }
          onMouseDown={(e) => {
            EventHandlers.onBeginResizing(e, eResizingFrom.MIDDLE_RIGHT);
          }}
          class="__resize-handle absolute top-0 z-[99999999] cursor-ew-resize  bg-white outline outline-blue-400"
          style={`
        width:  calc(${HANDLE_SIZE}px / var(--app-camera-zoom)); 
        height: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        left: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        top: calc(${HANDLE_SIZE}px / var(--app-camera-zoom));
        outline-width: calc(3px / var(--app-camera-zoom));
        transform: translate(${bottomRightPoint().x}px, ${
          bottomRightPoint().y -
          selectedObjects()[0].height / 2 -
          HANDLE_SIZE_HALF -
          HANDLE_SIZE / Store.camera().z
        }px)`}
        ></div>
      </Show>
    </>
  );
};
