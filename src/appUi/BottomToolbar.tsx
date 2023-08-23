import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eObjectType, eTool } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { nanoid } from "nanoid";

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
          isActive={false}
          title="Image"
          onClick={() => {
            const imageUrl = prompt("Enter image url");
            if (imageUrl) {
              Store.setObjects([
                ...Store.objects,
                {
                  id: nanoid(),
                  x: 0,
                  y: 0,
                  width: 200,
                  height: 200,
                  url: imageUrl,
                  hasSelfResized: false,
                  zIndex: Store.objects.length + 1,
                  type: eObjectType.IMAGE,
                  isFocused: false,
                },
              ]);
            }
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.TextArea />}
          isActive={false}
          title="eraser tool"
          onClick={() => {
            const text = prompt("Initial text (Optional)");
            if (text === null) return;

            Store.setObjects([
              ...Store.objects,
              {
                id: nanoid(),
                x: 0,
                y: 0,
                width: 200,
                height: 50,
                zIndex: Store.objects.length + 1,
                type: eObjectType.TEXT,
                fontSize: 16,
                lineHeight: 22,
                text,
                isFocused: false,
              },
            ]);
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
