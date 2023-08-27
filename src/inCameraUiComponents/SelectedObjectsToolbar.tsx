import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";
import { eObjectType, eTool, iObject } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { reconcile } from "solid-js/store";

export const SelectedObjectsToolbar: Component = (props) => {
  let myRef;
  const topLeftX = () =>
    Store.objectSelectionBox() === null
      ? 0
      : Store.objectSelectionBox()!.x +
        Store.objectSelectionBox()!.width / 2 -
        myRef!.offsetWidth / 2;

  const topLeftY = () =>
    Store.objectSelectionBox() === null
      ? 0
      : Store.objectSelectionBox()!.y - myRef!.offsetHeight * 1.2;

  const isAllBold = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBold;
    });
  });
  const isAllItalic = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isItalic;
    });
  });

  return (
    <div
      ref={myRef}
      data-pos-x={topLeftX()}
      data-pos-y={topLeftY()}
      id="__selected-objects-toolbar"
      // we need to work this out using JS values, so that we can put it into the data attributes,
      // so that we can then use those data attributes while we're doing movement
      style={`
        transform: 
            translate(${topLeftX()}px, ${topLeftY()}px);
        
    `}
      class="absolute left-0 top-0 z-[99999999] flex items-center justify-around space-x-3"
    >
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.TypeBold />}
          isActive={isAllBold()}
          title="Select tool"
          onMouseDown={(e) => {
            e.stopPropagation();
            const objs = [...Store.objects];
            Store.selectedObjectIds().forEach((id) => {
              const obj = Store.objects.find((obj) => obj.id === id);
              if (obj === undefined) return;
              const objIndex = Store.objects.findIndex((obj) => obj.id === id);
              objs[objIndex] = {
                ...obj,
                isBold: isAllBold() ? false : true,
              };
            });
            Store.setObjects(reconcile(objs));
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.TypeItalic />}
          isActive={isAllItalic()}
          title="eraser tool"
          onMouseDown={(e) => {
            e.stopPropagation();
            const objs = [...Store.objects];
            Store.selectedObjectIds().forEach((id) => {
              const obj = Store.objects.find((obj) => obj.id === id);
              if (obj === undefined) return;
              const objIndex = Store.objects.findIndex((obj) => obj.id === id);
              objs[objIndex] = {
                ...obj,
                isItalic: isAllItalic() ? false : true,
              };
            });
            Store.setObjects(reconcile(objs));
          }}
        />
      </div>

      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.TextAlignLeft />}
          isActive={Store.selectedTool() === eTool.SKETCH}
          title="Select tool"
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log("text left");
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.TextAlignCenter />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log("text center");
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.TextAlignRight />}
          isActive={Store.selectedTool() === eTool.ERASER}
          title="eraser tool"
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log("text right");
          }}
        />
      </div>
    </div>
  );
};
