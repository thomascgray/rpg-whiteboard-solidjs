import { Component } from "solid-js";
import { eTool, iObject } from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";

export interface iSVGObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const InfoPin: Component<iSVGObjectProps> = (props) => {
  return (
    <div
      data-pos-x={props.object.x}
      data-pos-y={props.object.y}
      data-width={props.object.width}
      data-height={props.object.height}
      id={props.object.id}
      class="__object absolute left-0 top-0 transform-gpu"
      classList={{
        "__selected-object hover:cursor-grab": props.isSelected,
        "__is-locked": props.object.isLocked,
        "outline-dashed outline-blue-400":
          props.isSelected && Store.selectedObjectIds().length > 1,
      }}
      draggable="false"
      onMouseDown={(e) => {
        if (Store.selectedTool() !== eTool.CURSOR) {
          return;
        }
        EventHandlers.onObjectMouseDown(e, props.object);
      }}
      style={`
outline-width: calc(2px / var(--app-camera-zoom));
max-width: none;
width: ${props.object.width}px;
height: ${props.object.height}px;
z-index: ${props.object.zIndex};
transform:
translate(${props.object.x}px,
  ${props.object.y}px)`}
    >
      <p class="bg-red-500 p-2 font-bold text-white">INFO PIN</p>
    </div>
  );
};
