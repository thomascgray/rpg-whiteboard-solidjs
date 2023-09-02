import { Component, createMemo, onMount, Show, createSignal } from "solid-js";
import * as Store from "../../store";
import { eObjectType } from "../../types";

import * as TextToolbars from "./object-toolbars/text-toolbars";
import * as ImageToolbars from "./object-toolbars/image-toolbar";

export const SelectedObjectsToolbar: Component = (props) => {
  let myRef;

  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  const topLeftX = () =>
    Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.x +
          Store.objectSelectionBox()!.width / 2 -
          width() / 2) *
        Store.camera().z;

  // TODO this seems to run an awful lot - work out whats happening there?
  const topLeftY = () => {
    return Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.y - height()) * Store.camera().z;
  };

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

  const allImageBattlemaps = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.type === eObjectType.IMAGE && obj.isBattlemap === true;
    });
  });

  const allImageBattleTokens = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.type === eObjectType.IMAGE && obj.isBattleToken === true;
    });
  });

  const ro = new ResizeObserver(() => {
    setWidth(myRef!.offsetWidth);
    setHeight(myRef!.offsetHeight);
  });

  onMount(() => {
    ro.observe(myRef!);
  });

  return (
    <>
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
        class="column absolute left-0 top-0 z-[99999999] flex origin-bottom flex-col items-center"
      >
        <Show when={allImageBattlemaps()}>
          <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
            <ImageToolbars.BattlemapToolbar />
          </div>
        </Show>

        <Show when={allImageBattleTokens()}>
          <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
            <ImageToolbars.BattleTokenToolbar />
          </div>
        </Show>

        <div class="flex justify-around space-x-3">
          <Show when={allText()}>
            <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
              <TextToolbars.FontStyleToolbar />

              <span class="border-r-4 border-zinc-400"></span>

              <TextToolbars.TextAlignmentToolbar />
            </div>
          </Show>

          <Show when={allImage()}>
            <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
              <ImageToolbars.ImageModeSelect />
            </div>
          </Show>
        </div>
      </div>
    </>
  );
};
