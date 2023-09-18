import { Component, createMemo, createEffect, onMount } from "solid-js";
import * as Store from "../../store";
import * as Config from "../../config";

export const ContextMenu: Component = (props) => {
  return (
    <div
      class={`${Config.UI_CLASS} boder-slate-300 absolute left-0 top-0 z-[2000] flex origin-top-left flex-col space-y-2 rounded-lg border border-solid bg-slate-200 shadow`}
      style={`
          border-width: var(--app-border-thickness);
          transform:
            scale(${1 / Store.camera().z})
            translate(
                ${Store.rightMouseDownPosCanvas()!.x * Store.camera().z}px,
                ${Store.rightMouseDownPosCanvas()!.y * Store.camera().z}px
            );`}
    >
      <button
        onClick={() => {
          alert("test 1");
        }}
        class="p-2 hover:bg-zinc-300"
      >
        Send to back
      </button>
      <button
        onClick={() => {
          alert("test 2");
        }}
        class="p-2 hover:bg-zinc-300"
      >
        Bring to front
      </button>
    </div>
  );
};
