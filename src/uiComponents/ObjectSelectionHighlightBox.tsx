import { Component } from "solid-js";
import * as Store from "../store";

export const ObjectSelectionHighlightBox: Component = (props) => {
  return (
    <div
      data-pos-x={Store.objectSelectionBoxPosX()}
      data-pos-y={Store.objectSelectionBoxPosY()}
      data-width={Store.objectSelectionBoxWidth()}
      data-height={Store.objectSelectionBoxHeight()}
      id="__object-selection-highlight-box"
      class="absolute outline-offset-1 top-0 left-0 pointer-events-none outline-2 outline-dashed outline-blue-400"
      style={`outline-width: var(--app-border-thickness); width: ${Store.objectSelectionBoxWidth()}px; height: ${Store.objectSelectionBoxHeight()}px; transform: translate(${Store.objectSelectionBoxPosX()}px, ${Store.objectSelectionBoxPosY()}px); z-index: 9999999`}
    >
      <p
        style="font-size: var(--app-font-size)"
        class="absolute bg-red-500 text-white -top-5 left-0"
      >
        {Store.selectedObjectIds().length}
      </p>
    </div>
  );
};
