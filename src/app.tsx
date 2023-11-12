import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { DragSelectionBoxComponent } from "./components/in-camera-ui/drag-selection-box";
import { ResizeHandles } from "./components/in-camera-ui/resize-handles";
import { ObjectSelectionHighlightBox } from "./components/in-camera-ui/object-selection-highlight-box";
import * as TestingUtils from "./utils/testing-utils";
import {
  ObjectCollection,
  LineOfSightWallCollection,
  LineOfSightWallAnchorCollection,
} from "./components/in-camera-ui/object-collections";
import * as ScreenToolbars from "./components/toolbars/screen-toolbars";
import { MainCanvas } from "./components/sketching-canvas/main-canvas";
import { LeftTray } from "./components/left-tray/LeftTray";
import { eTool } from "./types";
import { CanvasPenNib } from "./components/sketching-canvas/canvas-pen-nib";
import { SelectedObjectsToolbar } from "./components/toolbars/selected-objects-toolbar";
import { ModalWrapper } from "./components/modals/modal-wrapper";
import * as MeasuringSvgs from "./components/in-camera-ui/measuring-svgs";
import * as Config from "./config";
import { ContextMenu } from "./components/in-camera-ui/context-menu";
import { effect } from "solid-js/web";

export const App: Component = () => {
  onMount(() => {
    TestingUtils.makeDummyObjects(2000, 10);

    window.__cameraDom = document.getElementById(Config.APP_CAMERA_DOM_ID)!;
    window.__backgroundAppDom = document.getElementById(
      Config.APP_BACKGROUND_DOM_ID,
    )!;

    window.__barnabusGetObjects = () => {
      return Store.objects;
    };

    window.onmousedown = EventHandlers.onWindowMouseDown;
    window.onmouseup = EventHandlers.onWindowMouseUp;
    window.onkeydown = EventHandlers.onWindowKeyDown;
    window.onkeyup = EventHandlers.onWindowKeyUp;
    window.onmousemove = EventHandlers.onWindowMouseMove;
    window.addEventListener(
      "wheel",
      (e) => {
        EventHandlers.onWindowMouseWheel(e as WheelEvent);
      },
      { passive: false },
    );
    window.oncontextmenu = EventHandlers.onWindowContextMenu;
  });

  onCleanup(() => {
    Store.setObjects(reconcile([]));

    window.onmousedown = null;
    window.onmouseup = null;
    window.onkeydown = null;
    window.onkeyup = null;
    window.onmousemove = null;
    window.removeEventListener("wheel", EventHandlers.onWindowMouseWheel);
  });

  effect(() => {
    console.log(Store.camera());
  });

  return (
    <>
      <div
        id={Config.APP_BACKGROUND_DOM_ID}
        draggable="false"
        class="h-screen w-screen cursor-auto touch-none overflow-hidden bg-slate-100"
      >
        <div
          id={Config.APP_CAMERA_DOM_ID}
          data-pos-x={Store.camera().x}
          data-pos-y={Store.camera().y}
          data-pos-z={Store.camera().z}
          draggable="false"
          class=""
          style={`transform: scale(${Store.camera().z}) translate(${
            Store.camera().x
          }px, ${Store.camera().y}px)`}
        >
          {/* 
          The order of everything below is important, basically due to Z indexing.
          */}

          <ObjectCollection />
        </div>
        {/* end camera */}
      </div>

      {/* 
      all of the below happens OUTSIDE of the camera, so it's not affected by the camera's transform.
      */}

      <div class="absolute bottom-0 left-0 w-full bg-red-400 font-mono text-white">
        <p>
          is panning
          {JSON.stringify(Store.isPanning())}
        </p>
      </div>
    </>
  );
};
