import { Component, Show, createEffect, onMount } from "solid-js";
import {
  eBattlemapGridType,
  eImageMaskShapes,
  eImageMotionEffects,
  eObjectType,
  eTool,
  iObject,
} from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import * as MotionEffects from "../motion-effect-overlays";
import * as BattleMapFeatures from "../battlemap-grid-overlays";
import { DynamicLighting } from "../line-of-sight-overlays";
import * as Config from "../../config";

export interface iImageObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const ImageObject: Component<iImageObjectProps> = (props) => {
  onMount(() => {
    if (props.object.hasSelfResized === true) return;
    if (props.object.url && props.object.hasSelfResized === false) {
      createEffect((prev) => {
        let img = new Image();
        img.onload = function () {
          const index = Store.objects.findIndex(
            (obj) => obj.id === props.object.id,
          );
          Store.setObjects(index, {
            width: img.width,
            height: img.height,
            hasSelfResized: true,
          });

          // @ts-ignore - manual garbage collection baybee
          img = null;
        };
        img.src = props.object.url!;
      });
    }
  });

  return (
    <>
      <img
        data-pos-x={props.object.x}
        data-pos-y={props.object.y}
        data-width={props.object.width}
        data-height={props.object.height}
        data-is-battle-token={
          props.object.type === eObjectType.IMAGE && props.object.isBattleToken
        }
        data-object-type={props.object.type}
        id={props.object.id}
        class={`${Config.OBJECT_CLASS} absolute left-0 top-0`}
        width={props.object.width}
        height={props.object.height}
        classList={{}}
        draggable="false"
        src={props.object.url}
        style={`
      transform:
        translate(${props.object.x}px,
          ${props.object.y}px)`}
      />

      {/* <p
        class="z-999999 absolute left-0 top-0 text-white"
        style={`transform: translate(${props.object.x}px, ${props.object.y}px); z-index: ${props.object.zIndex};`}
      >
        {props.object.width}x{props.object.height}
      </p> */}
    </>
  );
};
