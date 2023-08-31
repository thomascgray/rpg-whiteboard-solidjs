import { Component, Show } from "solid-js";
import {
  eImageMaskShapes,
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  iObject,
} from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import * as MotionEffects from "../motion-effect-overlays";
import * as BattleMapFeatures from "../battlemap-grid-overlays";

export interface iSVGObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const SVGObject: Component<iSVGObjectProps> = (props) => {
  return (
    <div
      data-pos-x={props.object.x}
      data-pos-y={props.object.y}
      data-width={props.object.width}
      data-height={props.object.height}
      id={props.object.id}
      class="__object absolute left-0 top-0"
      classList={{
        "__selected-object hover:cursor-grab": props.isSelected,
        "outline-dashed outline-blue-400":
          props.isSelected && Store.selectedObjectIds().length > 1,
      }}
      draggable="false"
      onMouseDown={(e) => {
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
      <svg
        style="image-rendering: pixelated;"
        class="h-full w-full"
        width={props.object.width}
        height={props.object.height}
        shape-rendering="crispEdges"
        viewBox={`0 0 ${props.object.originalDimensions?.width} ${props.object.originalDimensions?.height}`}
        innerHTML={props.object.svgDataUri}
      ></svg>
    </div>
  );
};
