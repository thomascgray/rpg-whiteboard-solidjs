import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";

export const BottomToolbar: Component = (props) => {
  return (
    <div class="fixed bottom-3 left-[50%] flex translate-x-[-50%] flex-row justify-center space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
      <button
        onClick={() => {
          Store.setSelectedTool(eTool.DEFAULT);
        }}
        class="rounded-full p-3"
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
        class="rounded-full p-3"
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
        class="rounded-full p-3"
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
