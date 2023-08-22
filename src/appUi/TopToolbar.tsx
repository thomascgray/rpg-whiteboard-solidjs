import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";

export const TopToolbar: Component = (props) => {
  return (
    <div class="absolute top-0 left-0 w-full">
      <div class="mx-auto space-x-2 text-center">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M17.303 5.197A7.5 7.5 0 006.697 15.803a.75.75 0 01-1.061 1.061A9 9 0 1121 10.5a.75.75 0 01-1.5 0c0-1.92-.732-3.839-2.197-5.303zm-2.121 2.121a4.5 4.5 0 00-6.364 6.364.75.75 0 11-1.06 1.06A6 6 0 1118 10.5a.75.75 0 01-1.5 0c0-1.153-.44-2.303-1.318-3.182zm-3.634 1.314a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68z"
              clip-rule="evenodd"
            />
          </svg>
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
