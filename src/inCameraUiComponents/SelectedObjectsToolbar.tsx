import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";
import { eObjectType, eTool } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { nanoid } from "nanoid";

export const SelectedObjectsToolbar: Component = (props) => {
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id),
    );
  });

  const tlXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x);
  });
  const tlYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.y);
  });

  const brXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x + obj.width);
  });

  const topLeftX = () => Math.min(...tlXs());
  const topLeftY = () => Math.min(...tlYs());
  const width = createMemo(() => Math.max(...brXs()) - topLeftX());

  return (
    <div
      id="__selected-objects-toolbar"
      style={`
        transform: 
            translate(calc(${
              topLeftX() + width() / 2
            }px - 50%), calc(${topLeftY()}px - 120%));
        
    `}
      class="absolute left-0 top-0 z-[99999999] flex items-center justify-around"
    >
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.TypeBold />}
          isActive={Store.selectedTool() === eTool.SKETCH}
          title="Select tool"
          onMouseDown={(e) => {
            e.stopPropagation();

            console.log("bold");
            // Store.setSelectedTool(eTool.SKETCH);
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.TypeItalic />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onMouseDown={(e) => {
            e.stopPropagation();

            Store.setSelectedTool(eTool.ERASER);
          }}
        />
      </div>
    </div>
  );
};
