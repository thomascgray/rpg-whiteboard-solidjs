import { Component, Show, createEffect, createMemo, onMount } from "solid-js";
import { eImageMotionEffects, eObjectType, eTextAlign, iObject } from "./types";
import * as EventHandlers from "./event-handlers";
import * as Store from "./store";
import { ImageObject } from "./objects/Image";
import * as MotionEffects from "./motion-effects";

export interface BaseComponentProps {
  object: iObject;
  isSelected?: boolean;
}

export const BaseComponent: Component<BaseComponentProps> = (props) => {
  onMount(() => {
    if (props.object.type === eObjectType.IMAGE) {
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
    }

    if (props.object.type === eObjectType.TEXT) {
      const element = document.getElementById(props.object.id);
      const index = Store.objects.findIndex(
        (obj) => obj.id === props.object.id,
      );
      // @ts-ignore style doesn't exist on Element
      element!.children[0].style.height = "auto";
      let newHeight = element!.children[0].scrollHeight;
      // @ts-ignore style doesn't exist on Element
      element!.children[0].style.height = "100%";
      Store.setObjects(index, {
        // @ts-ignore value doesn't exist on Element
        text: element!.children[0].value!,
        height: newHeight,
      });
    }
  });

  return (
    <>
      {/* image objects */}
      <Show when={props.object.type === eObjectType.IMAGE}>
        <ImageObject object={props.object} isSelected={props.isSelected} />
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
          class="__object absolute left-0 top-0 bg-white"
          classList={{
            "cursor-default": !props.object.isFocused,
            "__selected-object hover:cursor-grab": props.isSelected,
            "outline-dashed outline-blue-400":
              props.isSelected && Store.selectedObjectIds().length > 1,
          }}
          draggable="false"
          onDblClick={(e) => {
            const index = Store.objects.findIndex(
              (obj) => obj.id === props.object.id,
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
            line-height: 1em;
            transform: translate(${props.object.x}px,
              ${props.object.y}px)`}
        >
          <textarea
            value={props.object.text || ""}
            class="h-full w-full resize-none overflow-y-hidden whitespace-normal border-none bg-white p-2 outline-none"
            classList={{
              "pointer-events-none": !props.object.isFocused,
              "cursor-default": !props.object.isFocused,
              "font-bold": props.object.isBold,
              italic: props.object.isItalic,
              "text-left": props.object.textAlign === eTextAlign.LEFT,
              "text-center": props.object.textAlign === eTextAlign.CENTER,
              "text-right": props.object.textAlign === eTextAlign.RIGHT,
              hidden: props.object.fontSize! * Store.camera().z < 6, // would be good to do this with css variables somehow
            }}
            rows={1}
            spellcheck={false}
            onInput={(e) => {
              const index = Store.objects.findIndex(
                (obj) => obj.id === props.object.id,
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
      </Show>
    </>
  );
};

export default BaseComponent;
