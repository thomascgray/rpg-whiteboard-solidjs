import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../../store";

export const DragSelectionBoxComponent: Component = (props) => {
  return (
    <div
      class="absolute left-0 top-0 border-2 border-dashed border-black"
      style={`
        border-width: var(--app-border-thickness); 
        width: ${Store.dragSelectionBox()?.width}px; 
        height: ${Store.dragSelectionBox()?.height}px; 
        transform: translate(${Store.dragSelectionBox()?.x}px, 
        ${Store.dragSelectionBox()?.y}px); 
        z-index: 9999999`}
    />
  );
};
