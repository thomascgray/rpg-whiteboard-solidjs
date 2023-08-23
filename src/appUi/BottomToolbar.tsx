import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";

export const BottomToolbar: Component = (props) => {
  return (
    <div class="fixed bottom-3 left-[50%] z-50 flex translate-x-[-50%] flex-row justify-center space-x-2">
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Cursor />}
          isActive={Store.selectedTool() === eTool.DEFAULT}
          title="Select tool"
          onClick={() => {
            Store.setSelectedTool(eTool.DEFAULT);
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.Eraser />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onClick={() => {
            Store.setSelectedTool(eTool.ERASER);
          }}
        />
      </div>

      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Image />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onClick={() => {
            Store.setSelectedTool(eTool.ERASER);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.TextArea />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onClick={() => {
            Store.setSelectedTool(eTool.ERASER);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.Pencil />}
          isActive={Store.selectedTool() === eTool.SKETCH}
          title="Select tool"
          onClick={() => {
            Store.setSelectedTool(eTool.SKETCH);
          }}
        />
      </div>
    </div>
  );
};
