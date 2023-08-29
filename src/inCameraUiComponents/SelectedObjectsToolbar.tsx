import { Component, createMemo, createEffect, onMount, Show } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";
import { eObjectType, eTool, iObject } from "../types";
import * as Icons from "../components/icons";
import * as Common from "../components/common-components";
import { reconcile } from "solid-js/store";
import * as TextToolbars from "./objectToolbars/TextToolbars";
import * as ImageToolbars from "./objectToolbars/ImageToolbar";
import * as GenericToolbars from "./objectToolbars/GenericToolbars";
import { withMinMax } from "../utils/general-utils";

export const SelectedObjectsToolbar: Component = (props) => {
  let myRef;

  const topLeftX = () =>
    Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.x +
          Store.objectSelectionBox()!.width / 2 -
          myRef!.offsetWidth / 2) *
        Store.camera().z;

  const topLeftY = () =>
    Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.y - myRef!.offsetHeight * 1.2) *
        Store.camera().z;

  const allText = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.type === eObjectType.TEXT;
    });
  });

  const allImage = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.type === eObjectType.IMAGE;
    });
  });

  return (
    <div
      ref={myRef}
      data-pos-x={topLeftX()}
      data-pos-y={topLeftY()}
      data-scale={1 / Store.camera().z}
      id="__selected-objects-toolbar"
      // we need to work this out using JS values, so that we can put it into the data attributes,
      // so that we can then use those data attributes while we're doing movement
      style={`
        transform: scale(${
          1 / Store.camera().z
        }) translate(${topLeftX()}px, ${topLeftY()}px);
    `}
      class="absolute left-0 top-0 z-[99999999] flex origin-bottom items-center justify-around space-x-3"
    >
      <Show when={allText()}>
        <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
          <TextToolbars.FontStyleToolbar />

          <span class="border-r-4 border-zinc-400"></span>

          <TextToolbars.TextAlignmentToolbar />
        </div>
      </Show>

      <Show when={allImage()}>
        <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
          <ImageToolbars.MotionEffects />
        </div>
      </Show>

      <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
        <GenericToolbars.SettingsToolbar />
      </div>
    </div>
  );
};
