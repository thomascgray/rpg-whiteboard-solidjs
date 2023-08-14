import { Component, createMemo, createEffect, onMount } from "solid-js";
import * as Store from "../store";

const borderWidth = 2;
// this draws a box around all the selected objects
export const ObjectSelectionHighlightBox: Component = (props) => {
  // const selectedObjects = createMemo(() => {
  //   console.log("selectedObjects");
  //   return Object.values(Store.objects).filter((obj) =>
  //     Store.selectedObjectIds().includes(obj.id)
  //   );
  // });

  // const tlXs = createMemo(() => {
  //   return selectedObjects().map((obj) => obj.pos.x);
  // });
  // const tlYs = createMemo(() => {
  //   return selectedObjects().map((obj) => obj.pos.y);
  // });

  // const topLeftPoint = createMemo(() => {
  //   return {
  //     x: Math.min(...tlXs()),
  //     y: Math.min(...tlYs()),
  //   };
  // });

  return (
    <div
      class="absolute outline-offset-1 top-0 left-0 pointer-events-none outline-2 outline-dashed outline-blue-400"
      style={`outline-width: ${
        borderWidth / Store.camera().z
      }px; width: ${Store.objectSelectionBoxWidth()}px; height: ${Store.objectSelectionBoxHeight()}px; transform: translate(${Store.objectSelectionBoxPosX()}px, ${Store.objectSelectionBoxPosY()}px); z-index: 9999999`}
    />
  );
};
