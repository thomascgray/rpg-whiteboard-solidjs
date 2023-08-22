import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";

export const LeftToolbar: Component = (props) => {
  return (
    <div class="fixed top-[50%] left-2 translate-y-[-50%] flex flex-col justify-center bg-slate-300 p-2 rounded-full space-y-2 text-white shadow border border-solid border-slate-400">
      <button class="bg-slate-400 p-3 rounded-full">
        <Icons.Cursor />
      </button>
      <button class="bg-slate-400 p-3 rounded-full">
        <Icons.Pencil />
      </button>
      <button class="bg-slate-400 p-3 rounded-full">
        <Icons.Eraser />
      </button>
    </div>
  );
};
