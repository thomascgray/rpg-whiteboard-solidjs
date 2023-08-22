import { Component, createMemo, createEffect, onMount, Show } from "solid-js";
import * as Store from "../store";
import { eResizingFrom, iPoint } from "../types";
import * as EventHandlers from "../event-handlers";

const HANDLE_SIZE = 15;
const HANDLE_SIZE_HALF = HANDLE_SIZE / 2;
const HANDLE_SIZE_QUARTER = HANDLE_SIZE / 4;
const HANDLE_SIZE_THREE_QUARTER = HANDLE_SIZE_HALF + HANDLE_SIZE_QUARTER;

export const ResizeHandles: Component = (props) => {
  // work out the bottom left and bottom right most points of all the selected objects
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id)
    );
  });

  const blXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x);
  });
  const blYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.y + obj.height);
  });

  const brXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x + obj.width);
  });
  const brYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.y + obj.height);
  });

  const bottomLeftPoint = createMemo(() => {
    return {
      x: Math.min(...blXs()),
      y: Math.max(...blYs()),
    };
  });
  const bottomRightPoint = createMemo(() => {
    return {
      x: Math.max(...brXs()),
      y: Math.max(...brYs()),
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
        class="__resize-handle absolute bg-white outline outline-blue-400 rounded-full cursor-sw-resize z-[99999999]"
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
        class="__resize-handle absolute bg-white outline outline-blue-400 rounded-full cursor-se-resize z-[99999999]"
      ></div>

      {/* right (for text boxes and other direct width editors) */}

      {/* need to change this to "text box only" */}
      <Show when={true}>
        <div></div>
      </Show>
    </>
  );
};
