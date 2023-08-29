import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eObjectType, eTool } from "../types";
import * as Icons from "../components/icons";
import * as Common from "../components/common-components";
import { nanoid } from "nanoid";

export const BottomToolbar: Component = (props) => {
  return (
    <div class="fixed bottom-3 left-[50%] z-50 flex translate-x-[-50%] flex-row justify-center space-x-2">
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Cursor />}
          isActive={Store.selectedTool() === eTool.DEFAULT}
          title="Select tool"
          onMouseDown={() => {
            Store.setSelectedTool(eTool.DEFAULT);
          }}
        />
      </div>

      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Pencil />}
          isActive={Store.selectedTool() === eTool.SKETCH}
          title="Select tool"
          onMouseDown={() => {
            Store.setSelectedTool(eTool.SKETCH);
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.Eraser />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onMouseDown={() => {
            Store.setSelectedTool(eTool.ERASER);
          }}
        />
      </div>

      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Image />}
          isActive={false}
          title="Image"
          onMouseDown={() => {
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
                  isLocked: false,
                },
              ]);

              Store.setSelectedObjectIds([]);
              Store.setIsDrawingSelectionBox(false);
              Store.setDrawingSelectionBoxWidth(0);
              Store.setDrawingSelectionBoxHeight(0);
            }
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.TextArea />}
          isActive={false}
          title="eraser tool"
          onMouseDown={() => {
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
                isLocked: false,
              },
            ]);

            Store.setIsDrawingSelectionBox(false);
            Store.setDrawingSelectionBoxHeight(0);
            Store.setDrawingSelectionBoxWidth(0);
            Store.setDrawingSelectionBoxStartPos({ x: 0, y: 0 });
          }}
        />
      </div>
    </div>
  );
};
