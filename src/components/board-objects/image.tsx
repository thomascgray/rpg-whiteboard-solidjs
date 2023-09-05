import { Component, Show, createEffect, onMount } from "solid-js";
import {
  eBattlemapGridType,
  eImageMaskShapes,
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  eTool,
  iObject,
} from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import * as MotionEffects from "../motion-effect-overlays";
import * as BattleMapFeatures from "../battlemap-grid-overlays";

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
        id={props.object.id}
        class="__object absolute left-0 top-0 transform-gpu"
        classList={{
          "__selected-object hover:cursor-grab":
            props.isSelected &&
            !props.object.isLocked &&
            Store.selectedTool() === eTool.CURSOR,
          "__is-locked": props.object.isLocked,
          "rounded-full": props.object.maskShape === eImageMaskShapes.CIRCLE,
          "cursor-cell": Store.selectedTool() === eTool.ADD_INFO_PIN,
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
    </>
  );
};
