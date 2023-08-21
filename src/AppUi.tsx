import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "./store";
import { eTool } from "./types";

export const AppUi: Component = (props) => {
  return (
    <div class="absolute top-0 left-0 w-full">
      <div class="mx-auto space-x-2">
        <button
          onClick={() => {
            Store.setSelectedTool(eTool.DEFAULT);
          }}
          class="px-4 py-2 text-white rounded active:scale-95 hover:scale-110"
          classList={{
            "bg-red-600": Store.selectedTool() === eTool.DEFAULT,
            "bg-red-400": Store.selectedTool() !== eTool.DEFAULT,
          }}
        >
          Hand
        </button>
        <button
          onClick={() => {
            Store.setSelectedTool(eTool.SKETCH);
          }}
          class="px-4 py-2 text-white rounded active:scale-95 hover:scale-110"
          classList={{
            "bg-red-600": Store.selectedTool() === eTool.SKETCH,
            "bg-red-400": Store.selectedTool() !== eTool.SKETCH,
          }}
        >
          Pen
        </button>
      </div>
    </div>
  );
};
