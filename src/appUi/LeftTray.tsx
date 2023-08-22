import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";

export const LeftTray: Component = (props) => {
  return (
    <div
      class="fixed top-[50%] flex translate-y-[-50%] flex-row items-start justify-center transition-transform"
      classList={{
        "-translate-x-[100px]": !Store.isLeftTrayExpanded(),
      }}
    >
      <div class="border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
        <p>hello world</p>
      </div>
      <div class="flex -translate-x-[2px] flex-col justify-center space-y-2 rounded-br-full rounded-tr-full border border-l-0 border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <button
          onClick={() => {
            Store.setIsLeftTrayExpanded(!Store.isLeftTrayExpanded());
          }}
          class="rounded-full p-3"
          classList={{
            "bg-slate-400 text-white hover:bg-slate-500":
              Store.selectedTool() !== eTool.DEFAULT,
            "text-red-500 bg-slate-700 ":
              Store.selectedTool() === eTool.DEFAULT,
          }}
        >
          <Icons.D6_6 />
        </button>
      </div>
    </div>
  );
};
