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
      data-translate={`${props.object.pos.x}/${props.object.pos.y}`}
      data-predrag-x={props.object.preDragPos.x}
      data-predrag-y={props.object.preDragPos.y}
      id={props.object.id}
      class="bg-red-200 absolute select-none top-0 left-0"
      classList={{
        "__selected-object": props.isSelected,
      }}
      draggable="false"
      onMouseDown={(e) => {
        EventHandlers.onObjectMouseDown(e, props.object);
      }}
      style={`width: ${props.object.dimensions.width}px; height: ${props.object.dimensions.height}px; transform: translate(${props.object.pos.x}px, ${props.object.pos.y}px)`}
    >
      <Show when={props.object.type === eObjectType.IMAGE}>
        <ImageObject object={props.object} />
      </Show>
    </div>
  );
};

export default BaseComponent;
