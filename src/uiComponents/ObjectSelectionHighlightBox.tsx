import { Component } from "solid-js";
import * as Store from "../store";

const borderWidth = 2;

export const ObjectSelectionHighlightBox: Component = (props) => {
  return (
    <div
      class="absolute outline-offset-1 top-0 left-0 pointer-events-none outline-2 outline-dashed outline-blue-400"
      style={`outline-width: ${
        borderWidth / Store.camera().z
      }px; width: ${Store.objectSelectionBoxWidth()}px; height: ${Store.objectSelectionBoxHeight()}px; transform: translate(${Store.objectSelectionBoxPosX()}px, ${Store.objectSelectionBoxPosY()}px); z-index: 9999999`}
    >
      <p
        style={`font-size: ${20 / Store.camera().z}px`}
        class="absolute bg-red-500 text-white -top-5 left-0"
      >
        {Store.selectedObjectIds().length}
      </p>
    </div>
  );
};
