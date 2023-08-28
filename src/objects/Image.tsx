import { Component, Show } from "solid-js";
import {
  eImageMaskShapes,
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  iObject,
} from "../types";
import * as EventHandlers from "../event-handlers";
import * as Store from "../store";
import * as MotionEffects from "../motion-effects";
import * as BattleMapFeatures from "../battlemap-features";

export interface ImageObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const ImageObject: Component<ImageObjectProps> = (props) => {
  return (
    <>
      <img
        data-pos-x={props.object.x}
        data-pos-y={props.object.y}
        data-width={props.object.width}
        data-height={props.object.height}
        id={props.object.id}
        class="__object absolute left-0 top-0 bg-red-200"
        classList={{
          "__selected-object hover:cursor-grab": props.isSelected,
          "rounded-full": props.object.maskShape === eImageMaskShapes.CIRCLE,
          "outline-dashed outline-blue-400":
            props.isSelected && Store.selectedObjectIds().length > 1,
        }}
        draggable="false"
        onMouseDown={(e) => {
          EventHandlers.onObjectMouseDown(e, props.object);
        }}
        src={props.object.url}
        style={`
        outline-width: calc(2px / var(--app-camera-zoom));
        max-width: none;
      width: ${props.object.width}px;
      height: ${props.object.height}px;
      z-index: ${props.object.zIndex};
      transform:
        translate(${props.object.x}px,
          ${props.object.y}px)`}
      />
      <Show when={props.object.motionEffect === eImageMotionEffects.RAIN}>
        <MotionEffects.Rain object={props.object} />
      </Show>

      <Show when={props.object.isBattlemap}>
        <BattleMapFeatures.BattlemapFeatures object={props.object} />
      </Show>
    </>
  );
};
