import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import * as Icons from "../icons";
import { DiceRoller } from "./DiceRoller";

export const LeftTray: Component = (props) => {
  return (
    <div
      class="fixed top-[50%] flex translate-y-[-50%] flex-row items-start justify-center transition-[left]"
      style={`
        left: ${Store.isLeftTrayExpanded() ? "0" : `-${window.__widthOfTray}px`}
      `}
    >
      {/* the actual tray */}
      <div
        id="tray-without-handle"
        class="border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg"
      >
        <DiceRoller />
      </div>

      {/* the buttons that sit outside */}
      <div class="flex -translate-x-[2px] flex-col justify-center space-y-2 rounded-br-2xl rounded-tr-2xl border border-l-0 border-solid border-slate-400 bg-slate-300 p-2 text-white">
        <button
          onClick={() => {
            Store.setIsLeftTrayExpanded(!Store.isLeftTrayExpanded());
          }}
          class="rounded-full p-3"
          classList={{
            "bg-slate-400 text-white hover:bg-slate-500":
              !Store.isLeftTrayExpanded(),
            "text-red-500 bg-slate-700 ": Store.isLeftTrayExpanded(),
          }}
        >
          <Icons.D6_6 />
        </button>
        <button
          onClick={() => {
            Store.setIsLeftTrayExpanded(!Store.isLeftTrayExpanded());
          }}
          class="rounded-full p-3"
          classList={{
            "bg-slate-400 text-white hover:bg-slate-500":
              !Store.isLeftTrayExpanded(),
            "text-red-500 bg-slate-700 ": Store.isLeftTrayExpanded(),
          }}
        >
          <Icons.D6_6 />
        </button>
        <button
          onClick={() => {
            Store.setIsLeftTrayExpanded(!Store.isLeftTrayExpanded());
          }}
          class="rounded-full p-3"
          classList={{
            "bg-slate-400 text-white hover:bg-slate-500":
              !Store.isLeftTrayExpanded(),
            "text-red-500 bg-slate-700 ": Store.isLeftTrayExpanded(),
          }}
        >
          <Icons.D6_6 />
        </button>
      </div>
    </div>
  );
};
