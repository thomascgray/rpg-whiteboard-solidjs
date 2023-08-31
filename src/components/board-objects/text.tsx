import { Component, Show, onMount } from "solid-js";
import {
  eImageMaskShapes,
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  iObject,
} from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import * as MotionEffects from "../motion-effect-overlays";
import * as BattleMapFeatures from "../battlemap-grid-overlays";

export interface iTextObjectProps {
  object: iObject;
  isSelected?: boolean;
}
export const TextObject: Component<iTextObjectProps> = (props) => {
  onMount(() => {
    const element = document.getElementById(props.object.id);
    const index = Store.objects.findIndex((obj) => obj.id === props.object.id);
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
  });

  return (
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
  );
};
