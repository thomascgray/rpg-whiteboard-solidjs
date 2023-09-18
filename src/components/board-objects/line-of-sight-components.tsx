import { Component } from "solid-js";
import { eTool, iObject } from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import * as Config from "../../config";
export interface iLineOfSightWallPointObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const WallAnchor: Component<iLineOfSightWallPointObjectProps> = (
  props,
) => {
  return (
    <div
      data-object-type={props.object.type}
      data-pos-x={props.object.x}
      data-pos-y={props.object.y}
      data-width={props.object.width}
      data-height={props.object.height}
      id={props.object.id}
      class={`${Config.OBJECT_CLASS} absolute left-0 top-0 transform-gpu`}
      classList={{
        "__selected-object hover:cursor-grab": props.isSelected,
        "__is-locked": props.object.isLocked,
        // "border-dashed border-blue-400 border-width: calc(4px / var(--app-camera-zoom))":
        //   props.isSelected && Store.selectedObjectIds().length > 1,
        "outline-dashed outline-red-400 outline-4":
          Store.lastWallAnchorAdded()?.id === props.object.id,
      }}
      draggable="false"
      style={`
        max-width: none;
        width: ${props.object.width}px;
        height: ${props.object.height}px;
        z-index: ${props.object.zIndex + 1500};
        transform: 
          scale(calc(1 / var(--app-camera-zoom)))
          translate(
            ${props.object.x * Store.camera().z}px,
            ${props.object.y * Store.camera().z}px
          )`}
    >
      <span class="pointer-events-none block h-full w-full origin-center rounded-full bg-gradient-to-tl from-indigo-300 to-teal-300"></span>
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
      class={`${Config.OBJECT_CLASS} z-[1500] stroke-[#00FFFF] transition-colors duration-500`}
      classList={{
        "hover:stroke-[#FF0000] cursor-pointer":
          Store.selectedTool() === eTool.DELETE_LOS_WALL,
      }}
      stroke-linecap="round"
      x1={props.object.x}
      y1={props.object.y}
      x2={props.object.wallEndPoint!.x}
      y2={props.object.wallEndPoint!.y}
      style={`
            stroke-width: calc(8px / var(--app-camera-zoom));
          `}
    />
  );
};

export const LightSource: Component<iLineOfSightWallPointObjectProps> = (
  props,
) => {
  return (
    <div
      data-pos-x={props.object.x}
      data-pos-y={props.object.y}
      data-width={props.object.width}
      data-height={props.object.height}
      data-object-type={props.object.type}
      id={props.object.id}
      class={`${Config.OBJECT_CLASS} absolute left-0 top-0 flex transform-gpu items-center justify-around rounded-full bg-red-500 text-2xl`}
      classList={{
        "__selected-object hover:cursor-grab":
          props.isSelected &&
          !props.object.isLocked &&
          Store.selectedTool() === eTool.CURSOR,
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
      translate(
        ${props.object.x}px,
        ${props.object.y}px
      )`}
    >
      💡
    </div>
  );
};
