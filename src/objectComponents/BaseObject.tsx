import { Component, Show, createEffect, createMemo } from "solid-js";
import { eObjectType, iObject } from "../types";
import * as EventHandlers from "../event-handlers";
import { ImageObject } from "./Image";

export interface BaseComponentProps {
  object: iObject;
  isSelected?: boolean;
}

export const BaseComponent: Component<BaseComponentProps> = (props) => {
  // const isHidden = Math.random() > 0.25;

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
      style={`outline-width: var(--app-border-thickness);
      width: ${props.object.dimensions.width}px;
      height: ${props.object.dimensions.height}px;
      transform:
        translate(${props.object.pos.x}px,
          ${props.object.pos.y}px)`}
    >
      {/* <p class="absolute bg-red-600 text-white top-[0px] left-0">asd</p>
      <p class="absolute bg-blue-600 text-white top-[20px] left-0">asd</p>
      <p class="absolute bg-green-600 text-white top-[40px] left-0">asd</p>
      <p class="absolute bg-yellow-600 text-white top-[60px] left-0">asd</p> */}
      {/* <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p> */}
      <Show when={props.object.type === eObjectType.IMAGE}>
        <ImageObject object={props.object} />
      </Show>
    </div>
  );
};

export default BaseComponent;
