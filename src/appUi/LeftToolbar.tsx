import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";

export const LeftToolbar: Component = (props) => {
  return (
    <div class="fixed top-[50%] left-2 translate-y-[-50%] flex flex-col justify-center bg-slate-300 p-2 rounded-full space-y-2 text-white shadow border border-solid border-slate-400">
      <button
        onClick={() => {
          Store.setSelectedTool(eTool.DEFAULT);
        }}
        class="p-3 rounded-full"
        classList={{
          "bg-slate-400 text-white hover:bg-slate-500":
            Store.selectedTool() !== eTool.DEFAULT,
          "text-red-500 bg-slate-700 ": Store.selectedTool() === eTool.DEFAULT,
        }}
      >
        <Icons.Cursor />
      </button>
      <button
        onClick={() => {
          Store.setSelectedTool(eTool.SKETCH);
        }}
        class="p-3 rounded-full"
        classList={{
          "bg-slate-400 text-white hover:bg-slate-500":
            Store.selectedTool() !== eTool.SKETCH,
          "text-red-500 bg-slate-700 ": Store.selectedTool() === eTool.SKETCH,
        }}
      >
        <Icons.Pencil />
      </button>
      <button
        onClick={() => {
          Store.setSelectedTool(eTool.ERASER);
        }}
        class="p-3 rounded-full"
        classList={{
          "bg-slate-400 text-white hover:bg-slate-500":
            Store.selectedTool() !== eTool.ERASER,
          "text-red-500 bg-slate-700 ": Store.selectedTool() === eTool.ERASER,
        }}
      >
        <Icons.Eraser />
      </button>
    </div>
  );
};
