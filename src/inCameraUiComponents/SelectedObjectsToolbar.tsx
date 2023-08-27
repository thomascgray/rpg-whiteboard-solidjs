import { Component, createMemo, createEffect, onMount, Show } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";
import { eObjectType, eTool, iObject } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { reconcile } from "solid-js/store";
import * as TextToolbars from "./objectToolbars/Text";
export const SelectedObjectsToolbar: Component = (props) => {
  let myRef;
  const topLeftX = () =>
    Store.objectSelectionBox() === null
      ? 0
      : Store.objectSelectionBox()!.x +
        Store.objectSelectionBox()!.width / 2 -
        myRef!.offsetWidth / 2;

  const topLeftY = () =>
    Store.objectSelectionBox() === null
      ? 0
      : Store.objectSelectionBox()!.y - myRef!.offsetHeight * 1.2;

  const allText = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.type === eObjectType.TEXT;
    });
  });

  return (
    <div
      ref={myRef}
      data-pos-x={topLeftX()}
      data-pos-y={topLeftY()}
      id="__selected-objects-toolbar"
      // we need to work this out using JS values, so that we can put it into the data attributes,
      // so that we can then use those data attributes while we're doing movement
      style={`
        transform: 
            translate(${topLeftX()}px, ${topLeftY()}px);
        
    `}
      class="absolute left-0 top-0 z-[99999999] flex items-center justify-around space-x-3"
    >
      <Show when={allText()}>
        <TextToolbars.FontStyleToolbar />

        <TextToolbars.TextAlignmentToolbar />
      </Show>
    </div>
  );
};
