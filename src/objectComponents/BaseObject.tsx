import { Component, Show, createEffect, createMemo, onMount } from "solid-js";
import { eObjectType, iObject } from "../types";
import * as EventHandlers from "../event-handlers";
import { ImageObject } from "./Image";
import * as Store from "../store";

export interface BaseComponentProps {
  object: iObject;
  isSelected?: boolean;
}

export const BaseComponent: Component<BaseComponentProps> = (props) => {
  onMount(() => {
    if (props.object.hasSelfResized === true) return;
    if (
      props.object.type === eObjectType.IMAGE &&
      props.object.url &&
      props.object.hasSelfResized === false
    ) {
      createEffect((prev) => {
        let img = new Image();
        img.onload = function () {
          const index = Store.objects.findIndex(
            (obj) => obj.id === props.object.id
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
      {/* image objects */}
      <Show when={props.object.type === eObjectType.IMAGE}>
        <img
          data-pos-x={props.object.x}
          data-pos-y={props.object.y}
          data-width={props.object.width}
          data-height={props.object.height}
          id={props.object.id}
          class="bg-red-200 absolute top-0 left-0 __inlens"
          classList={{
            // invisible: isHidden(),
            "__selected-object outline-dashed outline-blue-400 hover:cursor-grab":
              props.isSelected,
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
      </Show>

      <Show when={props.object.type === eObjectType.TEXT}>
        <div
          data-pos-x={props.object.x}
          data-pos-y={props.object.y}
          data-width={props.object.width}
          data-height={props.object.height}
          data-font-size={props.object.fontSize}
          data-object-type={props.object.type}
          id={props.object.id}
          class="border bg-red-200 border-solid border-slate-600 absolute top-0 left-0 __inlens"
          classList={{
            // "outline-dashed outline-red-400": props.object.isFocused,
            "cursor-default": !props.object.isFocused,
            "__selected-object outline-dashed outline-blue-400 hover:cursor-grab":
              props.isSelected,
          }}
          draggable="false"
          onDblClick={(e) => {
            // e.currentTarget.focus();
            const index = Store.objects.findIndex(
              (obj) => obj.id === props.object.id
            );
            Store.setObjects(index, {
              isFocused: true,
            });
          }}
          onMouseDown={(e) => {
            EventHandlers.onObjectMouseDown(e, props.object);
          }}
          style={`
            outline-width: calc(2px / var(--app-camera-zoom));
            max-width: none;
            width: ${props.object.width}px;
            height: ${props.object.height}px;
            z-index: ${props.object.zIndex};
            font-size: ${props.object.fontSize}px;
            line-height: ${props.object.lineHeight}px;
            transform: translate(${props.object.x}px,
              ${props.object.y}px)`}
        >
          <textarea
            value={props.object.text || ""}
            class="w-full h-full overflow-y-hidden resize-none p-[4px] disabled:bg-white bg-white"
            disabled={!props.object.isFocused}
            classList={{
              "pointer-events-none": !props.object.isFocused,
              "cursor-default": !props.object.isFocused,
            }}
            onInput={(e) => {
              const index = Store.objects.findIndex(
                (obj) => obj.id === props.object.id
              );
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + 4 + "px";

              Store.setObjects(index, {
                text: e.currentTarget.value,
                height: e.currentTarget.scrollHeight,
                fontSize: Number(
                  e.currentTarget.style.fontSize.replace("px", "")
                ),
              });
            }}
          ></textarea>
        </div>
      </Show>
    </>
  );
};

export default BaseComponent;
