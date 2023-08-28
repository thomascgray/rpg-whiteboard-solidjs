import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { SelectionBoxComponent } from "./inCameraUiComponents/SelectionBox";
import { ResizeHandles } from "./inCameraUiComponents/ResizeHandles";
import { ObjectSelectionHighlightBox } from "./inCameraUiComponents/ObjectSelectionHighlightBox";
import * as TestingUtils from "./utils/testing-utils";
import { ObjectCollection } from "./inCameraUiComponents/ObjectCollection";
import { TopToolbar } from "./appUi/TopToolbar";
import { BottomToolbar } from "./appUi/BottomToolbar";
import { SketchingCanvas } from "./appUi/SketchingCanvas";
import { LeftTray } from "./appUi/LeftTray";
import { eTool } from "./types";
import { BottomSketchToolbar } from "./appUi/BottomSketchToolbar";
import { SketchPenNib } from "./inCameraUiComponents/SketchPenNib";
import { SelectedObjectsToolbar } from "./inCameraUiComponents/SelectedObjectsToolbar";

const App: Component = () => {
  window.onmousedown = EventHandlers.onWindowMouseDown;
  window.onmouseup = EventHandlers.onWindowMouseUp;
  window.onkeydown = EventHandlers.onWindowKeyDown;
  window.onkeyup = EventHandlers.onWindowKeyUp;
  window.onmousemove = EventHandlers.onWindowMouseMove;
  // because we need to specify passive: false, we can't use the SolidJS onWheel event
  window.addEventListener(
    "wheel",
    (e) => {
      EventHandlers.onWindowMouseWheel(e as WheelEvent);
    },
    { passive: false },
  );

  onMount(() => {
    TestingUtils.makeDummyObjects(3, 30);
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
          class="h-screen w-screen origin-top-left select-none"
          style={`transform: scale(${Store.camera().z}) translate(${
            Store.camera().x
          }px, ${Store.camera().y}px)`}
        >
          <ObjectCollection />

          <Show when={Store.selectedObjectIds().length >= 1}>
            <ObjectSelectionHighlightBox />
            <ResizeHandles />
            <SelectedObjectsToolbar />
          </Show>

          {/* show the drawing box */}
          <Show
            when={
              Store.isDrawingSelectionBox() &&
              Store.drawingSelectionBoxWidth() > 2 &&
              Store.drawingSelectionBoxHeight() > 2
            }
          >
            <SelectionBoxComponent />
          </Show>
        </div>
      </div>

      {/* this order below is important, due to z indexing, etc. */}
      <SketchingCanvas />

      <Show when={Store.selectedTool() === eTool.SKETCH}>
        <SketchPenNib />
        <BottomSketchToolbar />
      </Show>
      <BottomToolbar />
      <TopToolbar />
      <LeftTray />
    </>
  );
};

export default App;
