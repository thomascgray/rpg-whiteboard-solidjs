import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { SelectionBoxComponent } from "./inCameraUiComponents/SelectionBox";
import { ResizeHandles } from "./inCameraUiComponents/ResizeHandles";
import { ObjectSelectionHighlightBox } from "./inCameraUiComponents/ObjectSelectionHighlightBox";
import * as TestingUtils from "./testing";
import { ObjectCollection } from "./inCameraUiComponents/ObjectCollection";
import { AppUi } from "./AppUi";
import { SketchingCanvas } from "./appUi/SketchingCanvas";

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
    { passive: false }
  );

  onMount(() => {
    TestingUtils.makeDummyObjects(2, 15);
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
        class="w-screen cursor-auto h-screen bg-slate-100 overflow-hidden touch-none"
      >
        <div
          data-pos-x={Store.camera().x}
          data-pos-y={Store.camera().y}
          data-pos-z={Store.camera().z}
          id="camera"
          draggable="false"
          onMouseDown={EventHandlers.onCanvasMouseDown}
          class="h-screen w-screen origin-top-left select-none"
          style={`transform: scale(${Store.camera().z}) translate(${
            Store.camera().x
          }px, ${Store.camera().y}px)`}
        >
          <ObjectCollection />

          <Show when={Store.selectedObjectIds().length >= 1}>
            <ObjectSelectionHighlightBox />
            <ResizeHandles />
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
      <SketchingCanvas />

      <AppUi />

      <div class="fixed bottom-0 left-0 w-full font-mono bg-red-600 text-white">
        <p>camera: {JSON.stringify(Store.camera(), null, 2)}</p>
        <p>tool: {JSON.stringify(Store.selectedTool(), null, 2)}</p>
      </div>
    </>
  );
};

export default App;
