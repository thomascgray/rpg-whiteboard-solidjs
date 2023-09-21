import { Component, For, Show } from "solid-js";
import * as Store from "../../store";
import {
  eLineOfSightTools,
  eMeasuringTools,
  eObjectType,
  eTool,
} from "../../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { nanoid } from "nanoid";
import * as InteractionHandlers from "../../interaction-handlers";
import * as DomUtils from "../../utils/dom-utils";
import * as Utils from "../../utils/general-utils";
import * as Config from "../../config";

export const BottomToolbar: Component = (props) => {
  return (
    <>
      <div
        class={`${Config.UI_CLASS} fixed bottom-3 left-[50%] z-50 flex translate-x-[-50%] flex-row justify-center space-x-2`}
      >
        <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
          <Common.CircleToolbarButton
            icon={<Icons.Cursor />}
            isActive={Store.selectedTool() === eTool.CURSOR}
            title="Select tool"
            onMouseDown={() => {
              Store.setSelectedTool(eTool.CURSOR);
            }}
          />
          <Common.CircleToolbarButton
            icon={<Icons.Pencil />}
            isActive={Store.selectedTool() === eTool.SKETCH}
            title="Pen tool"
            onMouseDown={() => {
              Store.setSelectedTool(eTool.SKETCH);
            }}
          />

          <Common.CircleToolbarButton
            icon={<Icons.Rulers />}
            isActive={Store.selectedTool() === eTool.MEASURING}
            title="Measuring tool"
            onMouseDown={() => {
              Store.setSelectedTool(eTool.MEASURING);
            }}
          />

          {/* <Common.CircleToolbarButton
            icon={<Icons.GeoFill />}
            isActive={Store.selectedTool() === eTool.ADD_INFO_PIN}
            title="Add info pin"
            onMouseDown={() => {
              Store.setSelectedTool(eTool.ADD_INFO_PIN);
            }}
          /> */}

          <Common.CircleToolbarButton
            icon={<Icons.EyeFill />}
            isActive={Store.selectedTool() === eTool.LINE_OF_SIGHT}
            title="Line of sight tools"
            onMouseDown={() => {
              Store.setSelectedTool(eTool.LINE_OF_SIGHT);
              Store.setSelectedLineOfSightTool(eLineOfSightTools.LOS_CURSOR);
            }}
          />
        </div>

        <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
          <Common.CircleToolbarButton
            icon={<Icons.Image />}
            isActive={false}
            title="Image"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
                    isLocked: false,
                  },
                ]);

                Store.setSelectedObjectIds([]);
                window.__app_selectedObjects = document.querySelectorAll(
                  ".__selected-object:not(.__is-locked)",
                );
                Store.setDragSelectionBox(null);
              }
            }}
          />
          <Common.CircleToolbarButton
            icon={<Icons.TextArea />}
            isActive={false}
            title="eraser tool"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const text = prompt("Initial text (Optional)");
              if (text === null) {
                return;
              }

              const centrePoint = Utils.screenToCanvas(
                window.innerWidth / 2,
                window.innerHeight / 2,
                Store.camera().x,
                Store.camera().y,
                Store.camera().z,
              );

              Store.setObjects([
                ...Store.objects,
                {
                  id: nanoid(),
                  x: centrePoint.x - 100,
                  y: centrePoint.y - 25,
                  width: 200,
                  height: 50,
                  zIndex: Store.objects.length + 1,
                  type: eObjectType.TEXT,
                  fontSize: 16,
                  lineHeight: 22,
                  text,
                  isLocked: false,
                },
              ]);

              Store.setSelectedObjectIds([]);
              window.__app_selectedObjects = document.querySelectorAll(
                ".__selected-object:not(.__is-locked)",
              );
            }}
          />
        </div>
      </div>
      <Show when={Store.selectedTool() === eTool.MEASURING}>
        <MeasuringToolbar />
      </Show>
      <Show when={Store.selectedTool() === eTool.LINE_OF_SIGHT}>
        <LineOfSightToolbar />
      </Show>
    </>
  );
};

export const TopToolbar: Component = (props) => {
  return (
    <div
      class={`${Config.UI_CLASS} fixed left-[50%] top-3 z-50 flex translate-x-[-50%] flex-row justify-center space-x-2`}
    >
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
    <div
      class={`${Config.UI_CLASS} fixed bottom-[5.5em] left-[50%] z-50 flex translate-x-[-50%] flex-row items-center justify-center space-x-2 rounded-2xl border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg`}
    >
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

export const MeasuringToolbar: Component = (props) => {
  return (
    <div
      class={`${Config.UI_CLASS} fixed bottom-[5.5em] left-[50%] z-50 flex translate-x-[-50%] flex-row justify-center space-x-2`}
    >
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Slash />}
          isActive={Store.selectedMeasuringTool() === eMeasuringTools.LINE}
          title="Measuring tool - Line"
          onMouseDown={() => {
            Store.setSelectedMeasuringTool(eMeasuringTools.LINE);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.CircleNoFill />}
          isActive={Store.selectedMeasuringTool() === eMeasuringTools.CIRCLE}
          title="Measuring tool - Circle"
          onMouseDown={() => {
            Store.setSelectedMeasuringTool(eMeasuringTools.CIRCLE);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.Square />}
          isActive={Store.selectedMeasuringTool() === eMeasuringTools.SQUARE}
          title="Measuring tool - Square"
          onMouseDown={() => {
            Store.setSelectedMeasuringTool(eMeasuringTools.SQUARE);
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.Triangle />}
          isActive={Store.selectedMeasuringTool() === eMeasuringTools.CONE}
          title="Measuring tool - Cone"
          onMouseDown={() => {
            Store.setSelectedMeasuringTool(eMeasuringTools.CONE);
          }}
        />
      </div>
    </div>
  );
};

export const LineOfSightToolbar: Component = (props) => {
  return (
    <div
      class={`${Config.UI_CLASS} fixed bottom-[5.5em] left-[50%] z-50 flex translate-x-[-50%] flex-row justify-center space-x-2`}
    >
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.Cursor />}
          isActive={
            Store.selectedLineOfSightTool() === eLineOfSightTools.LOS_CURSOR
          }
          title="Line of Sight - Cursor"
          onMouseDown={() => {
            Store.setSelectedLineOfSightTool(eLineOfSightTools.LOS_CURSOR);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.Bricks />}
          isActive={
            Store.selectedLineOfSightTool() ===
            eLineOfSightTools.LOS_ADD_WALL_ANCHOR
          }
          title="Line of Sight - Add Wall Anchor"
          onMouseDown={() => {
            Store.setSelectedLineOfSightTool(
              eLineOfSightTools.LOS_ADD_WALL_ANCHOR,
            );
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.Eraser />}
          isActive={
            Store.selectedLineOfSightTool() ===
            eLineOfSightTools.LOS_DELETE_WALL
          }
          title="Line of Sight - Delete Wall Anchor"
          onMouseDown={() => {
            Store.setSelectedLineOfSightTool(eLineOfSightTools.LOS_DELETE_WALL);
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.BulbFill />}
          isActive={
            Store.selectedLineOfSightTool() ===
            eLineOfSightTools.LOS_ADD_LIGHT_SOURCE
          }
          title="Line of Sight - Add Light Source"
          onMouseDown={() => {
            Store.setSelectedLineOfSightTool(
              eLineOfSightTools.LOS_ADD_LIGHT_SOURCE,
            );
          }}
        />
      </div>
    </div>
  );
};
