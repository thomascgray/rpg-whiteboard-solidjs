import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../../store";
import { eObjectType, eTool } from "../../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { nanoid } from "nanoid";
import * as InteractionHandlers from "../../interaction-handlers";
import * as DomUtils from "../../utils/dom-utils";

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

export const TopToolbar: Component = (props) => {
  return (
    <div class="fixed left-[50%] top-3 z-50 flex translate-x-[-50%] flex-row justify-center space-x-2">
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.ZoomIn />}
          isActive={false}
          title="Zoom In"
          onMouseDown={() => {
            InteractionHandlers.zoomCamera(
              window.innerWidth / 2,
              window.innerHeight / 2,
              -20,
            );
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.ZoomOut />}
          isActive={false}
          title="Zoom Out"
          onMouseDown={() => {
            InteractionHandlers.zoomCamera(
              window.innerWidth / 2,
              window.innerHeight / 2,
              20,
            );
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.HouseFill />}
          isActive={false}
          title="Reset Camera"
          onMouseDown={() => {
            // add the transition thing to the camera element, do the move, then remove it

            DomUtils.startCameraAnimating();
            Store.setCamera({
              x: 0,
              y: 0,
              z: 1,
            });

            setTimeout(() => {
              DomUtils.stopCameraAnimating();
            }, 500);
          }}
        />
      </div>
    </div>
  );
};

const ColourPickerButton: Component<{ colour: string }> = (props) => {
  return (
    <button
      onClick={() => {
        Store.setPenColour(props.colour);
      }}
      style={{ "background-color": props.colour }}
      class="h-3 w-3 rounded-full bg-slate-400 p-3 text-white hover:bg-slate-500"
      classList={{
        "outline outline-blue-400 outline-dashed":
          Store.penColour() === props.colour,
      }}
    >
      {/* <Icons.DropletFilled /> */}
    </button>
  );
};

const colours = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
];

export const BottomSketchToolbar: Component = (props) => {
  return (
    <div class="fixed bottom-[5rem] left-[50%] z-50 flex translate-x-[-50%] flex-row items-center justify-center space-x-2 rounded-2xl border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
      {/* buttons to change pen colour */}
      <div class="colours grid grid-cols-5 gap-2">
        <For each={colours}>
          {(colour) => <ColourPickerButton colour={colour} />}
        </For>
      </div>

      <input
        class="accent-slate-600"
        type="range"
        value={Store.penSize()}
        onInput={(e) => {
          Store.setPenSize(parseInt(e.currentTarget.value));
        }}
        min={10}
        step={5}
        max={50}
      />

      <div class="flex min-w-[50px] justify-around">
        <div
          style={`
          width: ${Store.penSize()}px;
          height: ${Store.penSize()}px;
          background-color: ${Store.penColour()};
      `}
          class="rounded-full"
        ></div>
      </div>
    </div>
  );
};
