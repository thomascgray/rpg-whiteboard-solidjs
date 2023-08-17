import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import { BaseComponent } from "./objectComponents/BaseObject";

import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { SelectionBoxComponent } from "./uiComponents/SelectionBox";
import { ResizeHandles } from "./uiComponents/ResizeHandles";
import { ObjectSelectionHighlightBox } from "./uiComponents/ObjectSelectionHighlightBox";
import * as TestingUtils from "./testing";
import { ObjectCollection } from "./uiComponents/ObjectCollection";

const App: Component = () => {
  window.onmousedown = EventHandlers.onMouseDown_Window;
  window.onmouseup = EventHandlers.onMouseUp_Window;
  window.onkeydown = EventHandlers.onKeyDown_Window;
  window.onkeyup = EventHandlers.onKeyUp_Window;
  window.onmousemove = EventHandlers.onMouseMove_Window;
  window.onwheel = EventHandlers.onMouseWheel_Window;

  onMount(() => {
    TestingUtils.makeDummyObjects(2000);
  });

  onCleanup(() => {
    Store.setObjects(reconcile({}));
  });

  return (
    <div
      style={{
        "--app-border-thickness": `${2 / Store.camera().z}px`,
        "--app-font-size": `${20 / Store.camera().z}px`,
        "--app-resize-handle-size": `${20 / Store.camera().z}px`,
      }}
      draggable="false"
      id="canvas"
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
  );
};

export default App;
