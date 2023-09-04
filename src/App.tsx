import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { DragSelectionBoxComponent } from "./components/in-camera-ui/drag-selection-box";
import { ResizeHandles } from "./components/in-camera-ui/resize-handles";
import { ObjectSelectionHighlightBox } from "./components/in-camera-ui/object-selection-highlight-box";
import * as TestingUtils from "./utils/testing-utils";
import { ObjectCollection } from "./components/in-camera-ui/object-collection";
import * as ScreenToolbars from "./components/toolbars/screen-toolbars";
import { MainCanvas } from "./components/sketching-canvas/main-canvas";
import { LeftTray } from "./components/left-tray/LeftTray";
import { eTool } from "./types";
import { CanvasPenNib } from "./components/sketching-canvas/canvas-pen-nib";
import { SelectedObjectsToolbar } from "./components/toolbars/selected-objects-toolbar";
import { ModalWrapper } from "./components/modals/modal-wrapper";
import * as MeasuringSvgs from "./components/in-camera-ui/measuring-svgs";

const App: Component = () => {
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

  onMount(() => {
    TestingUtils.makeDummyObjects(3, 10);
    window.__cameraDom = document.getElementById("camera")!;
    window.__backgroundAppDom = document.getElementById("app_background")!;
    window.__canvasDom = document.getElementById("canvas")!;

    // @ts-ignore
    window.__canvasContext = window.__canvasDom.getContext("2d");
  });

  onCleanup(() => {
    Store.setObjects(reconcile([]));
  });

  return (
    <>
      <div
        style={{
          "--app-border-thickness": `${2 / Store.camera().z}px`,
          "--app-font-size": `${20 / Store.camera().z}px`,
          "--app-resize-handle-size": `${20 / Store.camera().z}px`,
          "--app-camera-zoom": `${Store.camera().z}`,
          "background-color":
            Store.boardSettings.boardBackgroundColour || "white",
          "--app-active-pen-colour": Store.penColour() || "black",
          "--app-measuring-tool-colour": "#e74c3c",
        }}
        draggable="false"
        id="app_background"
        onMouseDown={EventHandlers.onCanvasMouseDown}
        class="h-screen w-screen cursor-auto touch-none overflow-hidden bg-slate-100"
      >
        <div
          data-pos-x={Store.camera().x}
          data-pos-y={Store.camera().y}
          data-pos-z={Store.camera().z}
          id="camera"
          draggable="false"
          class="h-screen w-screen origin-top-left transform-gpu select-none"
          style={`transform: scale(${Store.camera().z}) translate(${
            Store.camera().x
          }px, ${Store.camera().y}px)`}
        >
          <ObjectCollection />

          {/* object selection stuff */}
          <Show when={Store.selectedObjectIds().length >= 1}>
            <ObjectSelectionHighlightBox />
            <ResizeHandles />
            <SelectedObjectsToolbar />
          </Show>

          {/* show the drawing box */}
          <Show when={Store.dragSelectionBox()}>
            <DragSelectionBoxComponent />
          </Show>

          <Show when={Store.isMeasuringDistance()}>
            <MeasuringSvgs.Wrapper />
          </Show>
        </div>
        {/* end camera */}
      </div>

      {/* this order below is important, due to z indexing, etc. */}
      <MainCanvas />

      <Show when={Store.selectedTool() === eTool.SKETCH}>
        <CanvasPenNib />
        <ScreenToolbars.BottomSketchToolbar />
      </Show>
      <ScreenToolbars.BottomToolbar />
      <ScreenToolbars.TopToolbar />
      <LeftTray />

      <Show when={Store.currentModal() !== null}>
        <ModalWrapper />
      </Show>

      {/* <div class="absolute bottom-0 left-0 w-full bg-red-400 font-mono text-white">
        <p>
          measuring scale
          {JSON.stringify(Store.measuringScale())}
        </p>
      </div> */}
    </>
  );
};

export default App;
