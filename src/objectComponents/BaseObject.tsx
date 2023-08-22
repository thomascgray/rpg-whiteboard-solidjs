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
          class="bg-red-200 absolute top-0 left-0 __object"
          classList={{
            "__selected-object hover:cursor-grab": props.isSelected,
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
      </Show>

      {/* text objects */}
      <Show when={props.object.type === eObjectType.TEXT}>
        <div
          data-pos-x={props.object.x}
          data-pos-y={props.object.y}
          data-width={props.object.width}
          data-height={props.object.height}
          data-font-size={props.object.fontSize}
          data-line-height={props.object.lineHeight}
          data-object-type={props.object.type}
          id={props.object.id}
          class="__object absolute bg-red-600 top-0 left-0"
          classList={{
            "cursor-default": !props.object.isFocused,
            "__selected-object hover:cursor-grab": props.isSelected,
            "outline-dashed outline-blue-400":
              props.isSelected && Store.selectedObjectIds().length > 1,
          }}
          draggable="false"
          onDblClick={(e) => {
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
            --text-color: red;
            outline-width: calc(2px / var(--app-camera-zoom));
            max-width: none;
            width: ${props.object.width}px;
            height: ${props.object.height}px;
            z-index: ${props.object.zIndex};
            font-size: ${props.object.fontSize}px;
            line-height: 1em;
            transform: translate(${props.object.x}px,
              ${props.object.y}px)`}
        >
          <textarea
            value={props.object.text || ""}
            class="w-full bg-white whitespace-normal h-full outline-none border-none overflow-y-hidden resize-none"
            classList={{
              "pointer-events-none": !props.object.isFocused,
              "cursor-default": !props.object.isFocused,
              hidden: props.object.fontSize! * Store.camera().z < 6, // would be good to do this with css variables somehow
            }}
            rows={1}
            spellcheck={false}
            onInput={(e) => {
              const index = Store.objects.findIndex(
                (obj) => obj.id === props.object.id
              );

              e.currentTarget.style.height = "auto";
              let newHeight = e.currentTarget.scrollHeight;
              e.currentTarget.style.height = "100%";

              Store.setObjects(index, {
                text: e.currentTarget.value,
                height: newHeight,
              });
            }}
          ></textarea>
        </div>
      </Show>

      {/* svg objects */}
      <Show when={props.object.type === eObjectType.SVG}>
        <div
          data-pos-x={props.object.x}
          data-pos-y={props.object.y}
          data-width={props.object.width}
          data-height={props.object.height}
          id={props.object.id}
          class="absolute top-0 left-0 __object"
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
            class="w-full h-full"
            width={props.object.width}
            height={props.object.height}
            shape-rendering="crispEdges"
            viewBox={`0 0 ${props.object.originalDimensions?.width} ${props.object.originalDimensions?.height}`}
            innerHTML={props.object.svgDataUri}
          ></svg>
        </div>
      </Show>

      {/* <span
        class="bg-red-600 text-white font-mono z-[999999] absolute top-0 left-0"
        style={`transform: translate(${props.object.x}px, ${props.object.y}px)`}
      >
        x: {props.object.x}
        <br />
        y: {props.object.y}
      </span> */}
    </>
  );
};

export default BaseComponent;
