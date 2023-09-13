import { Component, createMemo, onMount, Show, createSignal } from "solid-js";
import * as Store from "../../store";
import { eObjectType } from "../../types";
import * as Common from "../common-components";
import * as Icons from "../icons";
import * as Config from "../../config";
import * as TextToolbars from "./object-toolbars/text-toolbars";
import * as ImageToolbars from "./object-toolbars/image-toolbar";

export const SelectedObjectsToolbar: Component = (props) => {
  let myRef;

  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  const cameraZ = createMemo(() => Store.camera().z);

  const topLeftX = () =>
    Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.x +
          Store.objectSelectionBox()!.width / 2 -
          width() / 2) *
        cameraZ();

  // TODO this seems to run an awful lot - work out whats happening there?
  const topLeftY = () => {
    return Store.objectSelectionBox() === null
      ? 0
      : (Store.objectSelectionBox()!.y - height() - 15 / cameraZ()) * cameraZ();
  };

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
        class={`${Config.UI_CLASS} absolute left-0 top-0 z-[99999999] flex origin-bottom flex-col items-center`}
        // we need to work this out using JS values, so that we can put it into the data attributes,
        // so that we can then use those data attributes while we're doing movement
        style={`
        transform: scale(${
          1 / Store.camera().z
        }) translate(${topLeftX()}px, ${topLeftY()}px);
    `}
      >
        <Show
          when={
            Store.so_every("type", eObjectType.IMAGE) &&
            Store.so_every("isBattlemap", true)
          }
        >
          <div class="rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
            <ImageToolbars.BattlemapToolbar />
          </div>
        </Show>

        <Show
          when={
            Store.so_every("type", eObjectType.IMAGE) &&
            Store.so_every("isBattleToken", true)
          }
        >
          <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
            <ImageToolbars.BattleTokenToolbar />
          </div>
        </Show>

        <div class="flex justify-around space-x-3">
          <Show when={Store.so_every("type", eObjectType.TEXT)}>
            <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
              <TextToolbars.FontStyleToolbar />

              <span class="border-r-4 border-zinc-400"></span>

              <TextToolbars.TextAlignmentToolbar />
            </div>
          </Show>

          <Show when={Store.so_every("type", eObjectType.IMAGE)}>
            <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
              <ImageToolbars.ImageModeSelect />
            </div>
          </Show>

          <div class="space-x-2 rounded-xl border border-solid border-zinc-400 bg-zinc-300 p-2 text-white shadow-lg">
            <Common.SquareToolbarButton
              icon={
                Store.so_every("isLocked", true) ? (
                  <Icons.LockFill />
                ) : (
                  <Icons.UnlockFill />
                )
              }
              isActive={Store.so_every("isLocked", true)}
              title="Enable battle token features"
              onMouseDown={(e) => {
                e.stopPropagation();

                Store.so_prop_set(
                  "isLocked",
                  !Store.so_every("isLocked", true),
                );

                window.__app_selectedObjects = document.querySelectorAll(
                  ".__selected-object:not(.__is-locked)",
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
