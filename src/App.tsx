import { type Component, onMount, For, Show, onCleanup } from "solid-js";
import { BaseComponent } from "./objectComponents/BaseObject";
import { nanoid } from "nanoid";
import { eObjectType, iObject } from "./types";
import * as _ from "lodash";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { reconcile } from "solid-js/store";
import { SelectionBoxComponent } from "./uiComponents/SelectionBox";
import { ResizeHandles } from "./uiComponents/ResizeHandles";
import { ObjectSelectionHighlightBox } from "./uiComponents/ObjectSelectionHighlightBox";

const App: Component = () => {
  window.onmousedown = EventHandlers.onMouseDown_Window;
  window.onmouseup = EventHandlers.onMouseUp_Window;
  window.onkeydown = EventHandlers.onKeyDown_Window;
  window.onkeyup = EventHandlers.onKeyUp_Window;
  window.onmousemove = EventHandlers.onMouseMove_Window;
  window.onwheel = EventHandlers.onMouseWheel_Window;

  onMount(() => {
    const newObjects: { [key: string]: iObject } = {};

    for (let i = 0; i < 1000; i++) {
      let pos = {
        x: Math.random() * 30_000,
        y: Math.random() * 30_000,
      };
      let id = nanoid();
      newObjects[id] = {
        id,
        pos,
        preDragPos: pos,
        preResizePos: pos,
        url: `/barney${_.sample([1, 2, 3, 4, 5])}.jpg`,
        zIndex: i,
        type: eObjectType.IMAGE,
        isFocused: false,
        dimensions: {
          width: 100,
          height: 100,
        },
        preResizeDimensions: {
          width: 100,
          height: 100,
        },
      };
    }
    Store.setObjects(newObjects);
  });

  onCleanup(() => {
    Store.setObjects(reconcile({}));
  });

  return (
    <div
      draggable="false"
      id="canvas"
      class="w-screen cursor-auto h-screen bg-slate-100 overflow-hidden touch-none"
      onMouseDown={EventHandlers.onCanvasMouseDown}
    >
      <div
        id="camera"
        draggable="false"
        class="h-screen w-screen origin-top-left select-none"
        style={`transform: scale(${Store.camera().z}) translate(${
          Store.camera().x
        }px, ${Store.camera().y}px)`}
      >
        <div class="non-selected-objects">
          <For
            each={_.chunk(
              Object.values(Store.objects).filter(
                (obj) => !Store.selectedObjectIds().includes(obj.id)
              ),
              20
            )}
          >
            {(objectsOuter) => (
              <div>
                <For each={objectsOuter}>
                  {(objectInner) => <BaseComponent object={objectInner} />}
                </For>
              </div>
            )}
          </For>
        </div>

        {/* selected */}
        <div class="selected-objects">
          <For
            each={Object.values(Store.objects).filter((obj) =>
              Store.selectedObjectIds().includes(obj.id)
            )}
          >
            {(object) => <BaseComponent object={object} isSelected={true} />}
          </For>
        </div>

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

      <div class="absolute bottom-0 bg-red-500 text-white w-full font-mono">
        {/* <p>mouse buttons: {Store.heldMouseButtons()}</p>
        <p>camera: {JSON.stringify(Store.camera())}</p> */}
        {/* <p>selected object ids: {JSON.stringify(Store.selectedObjectIds())}</p> */}
        {/* <p>
          is drawing selection box
          {JSON.stringify(Store.isDrawingSelectionBox())}
        </p>
        <p>
          drawingbox pos {JSON.stringify(Store.drawingSelectionBoxStartPos())}
        </p>
        <p>
          drawing box width: {JSON.stringify(Store.drawingSelectionBoxWidth())}
        </p>
        <p>
          drawing box height:{" "}
          {JSON.stringify(Store.drawingSelectionBoxHeight())}
        </p> */}
      </div>
    </div>
  );
};

export default App;
