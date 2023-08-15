import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";

export const SelectionBoxComponent: Component = (props) => {
  return (
    <div
      class="absolute top-0 left-0 border-2 border-dashed border-black"
      style={`border-width: var(--app-border-thickness); width: ${Store.drawingSelectionBoxWidth()}px; height: ${Store.drawingSelectionBoxHeight()}px; transform: translate(${
        Store.drawingSelectionBoxStartPos().x
      }px, ${Store.drawingSelectionBoxStartPos().y}px); z-index: 9999999`}
    />
  );
};
