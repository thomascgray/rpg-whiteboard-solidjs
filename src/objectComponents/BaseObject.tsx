import { Component, Show, createEffect, createMemo } from "solid-js";
import { eObjectType, iObject } from "../types";
import * as EventHandlers from "../event-handlers";
import { ImageObject } from "./Image";

export interface BaseComponentProps {
  object: iObject;
  isSelected?: boolean;
}

export const BaseComponent: Component<BaseComponentProps> = (props) => {
  return (
    <div
      data-pos-x={props.object.pos.x}
      data-pos-y={props.object.pos.y}
      data-width={props.object.dimensions.width}
      data-height={props.object.dimensions.height}
      id={props.object.id}
      class="bg-red-200 absolute select-none top-0 left-0 __inlens"
      classList={{
        "__selected-object hover:cursor-grab": props.isSelected,
      }}
      draggable="false"
      onMouseDown={(e) => {
        EventHandlers.onObjectMouseDown(e, props.object);
      }}
      style={`outline-width: var(--app-border-thickness); width: ${props.object.dimensions.width}px; height: ${props.object.dimensions.height}px; transform: translate(${props.object.pos.x}px, ${props.object.pos.y}px)`}
    >
      <p class="absolute top-0 left-0 bg-red-600 text-white">
        x: {props.object.pos.x}
      </p>
      <p class="absolute top-5 left-0 bg-blue-600 text-white">
        y: {props.object.pos.y}
      </p>
      <p class="absolute top-10 left-0 bg-green-600 text-white">
        width: {props.object.dimensions.width}
      </p>
      <p class="absolute top-16 left-0 bg-yellow-600 text-white">
        height: {props.object.dimensions.height}
      </p>
      <Show when={props.object.type === eObjectType.IMAGE}>
        <ImageObject object={props.object} />
      </Show>
    </div>
  );
};

export default BaseComponent;
