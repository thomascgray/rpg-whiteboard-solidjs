import { Component, createMemo, createEffect, onMount } from "solid-js";
import * as Store from "../store";
import { eResizingFrom, iPoint } from "../types";
import * as EventHandlers from "../event-handlers";

export const ResizeHandles: Component = (props) => {
  // work out the bottom left and bottom right most points of all the selected objects
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id)
    );
  });

  const blXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.pos.x);
  });
  const blYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.pos.y + obj.dimensions.height);
  });

  const brXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.pos.x + obj.dimensions.width);
  });
  const brYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.pos.y + obj.dimensions.height);
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
      <div
        onMouseDown={(e) => {
          EventHandlers.onBeginResizing(e, eResizingFrom.BOTTOM_LEFT);
        }}
        style={`width: ${20 / Store.camera().z}px; height: ${
          20 / Store.camera().z
        }px; transform: translate(${bottomLeftPoint().x}px, ${
          bottomLeftPoint().y
        }px)`}
        class="absolute top-0 left-0 bg-red-500 rounded-full cursor-sw-resize"
      >
        L
      </div>
      <div
        onMouseDown={(e) => {
          EventHandlers.onBeginResizing(e, eResizingFrom.BOTTOM_RIGHT);
        }}
        style={`width: ${20 / Store.camera().z}px; height: ${
          20 / Store.camera().z
        }px; transform: translate(${bottomRightPoint().x}px, ${
          bottomRightPoint().y
        }px)`}
        class="absolute top-0 left-0 bg-red-500 rounded-full cursor-se-resize"
      >
        R
      </div>
    </>
  );
};
