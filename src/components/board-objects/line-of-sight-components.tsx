import { Component } from "solid-js";
import { eTool, iObject } from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";

export interface iLineOfSightWallPointObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const WallAnchor: Component<iLineOfSightWallPointObjectProps> = (
  props,
) => {
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
        "border border-solid border-red-500":
          Store.lastWallAnchorAdded()?.id === props.object.id,
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
border-width: calc(4px / var(--app-camera-zoom));
max-width: none;
width: ${props.object.width}px;
height: ${props.object.height}px;
z-index: ${props.object.zIndex};

transform: scale(calc(1 / var(--app-camera-zoom)))
translate(${props.object.x * Store.camera().z}px,
  ${props.object.y * Store.camera().z}px)`}
    >
      <span class="block h-full w-full origin-center rounded-full bg-gradient-to-tl from-indigo-300 to-teal-300 outline-dotted outline-white"></span>
    </div>
  );
};

export const Wall: Component<iLineOfSightWallPointObjectProps> = (props) => {
  return (
    <line
      data-pos-x={props.object.x}
      data-pos-y={props.object.y}
      data-pos-x2={props.object.wallEndPoint!.x}
      data-pos-y2={props.object.wallEndPoint!.y}
      data-width={props.object.width}
      data-height={props.object.height}
      data-type={props.object.type}
      id={props.object.id}
      class="z-[9999999999]"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("aaaaa");
        if (Store.selectedTool() === eTool.DELETE_LOS_WALL) {
          Store.deleteObjectsById([props.object.id]);
          return;
        }
      }}
      x1={props.object.x}
      y1={props.object.y}
      x2={props.object.wallEndPoint!.x}
      y2={props.object.wallEndPoint!.y}
      style={`
            stroke: #00FFFF;
            stroke-width: calc(5px / var(--app-camera-zoom));
          `}
    />
  );
};
