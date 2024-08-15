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
      <div
        style={`
        width: ${props.object.width}px;
        height: ${props.object.height}px;
        background-image: url(${props.object.url});
        background-size: cover;
        // backface-visibility: hidden;
        transform: translateX(${props.object.x}px) translateY(${props.object.y}px) translateZ(0);`}
        data-pos-x={props.object.x}
        data-pos-y={props.object.y}
        data-width={props.object.width}
        data-height={props.object.height}
        data-is-battle-token={
          props.object.type === eObjectType.IMAGE && props.object.isBattleToken
        }
        // src={props.object.url}
        data-object-type={props.object.type}
        id={props.object.id}
        draggable="false"
        classList={{
          "pointer-events-none": true,
          "__selected-object hover:cursor-grab":
            props.isSelected &&
            !props.object.isLocked &&
            Store.isCursorToolSelected(),
          "__is-locked": props.object.isLocked,
          "rounded-full":
            props.object.maskShape === eImageMaskShapes.CIRCLE ||
            props.object.isBattleToken,
          "cursor-cell": Store.selectedTool() === eTool.ADD_INFO_PIN,
          // "outline-dashed outline-blue-400":
          //   props.isSelected && Store.selectedObjectIds().length > 1,
        }}
        class={`${Config.OBJECT_CLASS} absolute left-0 top-0 bg-red-500`}
      ></div>

      <Show when={props.object.motionEffect === eImageMotionEffects.RAIN}>
        <MotionEffects.Rain object={props.object} />
      </Show>

      <Show when={props.object.battlemap_isDynamicLighting}>
        <DynamicLighting object={props.object} />
      </Show>

      <Show
        when={
          props.object.battlemap_gridType === eBattlemapGridType.SQUARES &&
          props.object.battlemap_shouldRenderGrid === true
        }
      >
        <BattleMapFeatures.SquaresOverlay object={props.object} />
      </Show>
      <Show
        when={
          props.object.battlemap_gridType ===
          eBattlemapGridType.HEXAGONS_FLAT_TOP
        }
      >
        <BattleMapFeatures.HexesFlatTopOverlay object={props.object} />
      </Show>
      <Show
        when={
          props.object.battlemap_gridType ===
          eBattlemapGridType.HEXAGONS_POINTY_TOP
        }
      >
        <BattleMapFeatures.HexesPointyTopOverlay object={props.object} />
      </Show>
      {/* <p
        class="z-999999 absolute left-0 top-0 text-white"
        style={`transform: translate(${props.object.x}px, ${props.object.y}px); z-index: ${props.object.zIndex};`}
      >
        {props.object.width}x{props.object.height}
      </p> */}
    </>
  );
};
