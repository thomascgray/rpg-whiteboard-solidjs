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
  const derivedUrl = createMemo(() => props.object.url);
  const derivedId = createMemo(() => props.object.id);

  // onMount(() => {
  //   console.log("on mount");
  // });
  createEffect((prev) => {
    const x = derivedUrl();
    console.log("create effect");
    console.log("prev", prev);
    console.log("derivedUrl", x);
    return x;
  });

  // onMount(() => {
  //   "on mount";
  // });
  // if (props.object.type === eObjectType.IMAGE) {
  //   createEffect((prev) => {
  //     console.log("prev", prev);
  //     console.log("upate image");
  //     const _url = derivedUrl();
  //     const _id = derivedId();
  //     if (prev === _url) {
  //       return;
  //     }
  //     if (_url) {
  //       let img = new Image();
  //       img.onload = function () {
  //         Store.setObjects(_id, {
  //           width: img.width,
  //           height: img.height,
  //         });

  //         // @ts-ignore - manual garbage collection baybee
  //         img = null;
  //       };
  //       img.src = _url;
  //     }
  //     return _url;
  //   });
  // }

  return (
    <>
      <img
        data-pos-x={props.object.x}
        data-pos-y={props.object.y}
        data-width={props.object.width}
        data-height={props.object.height}
        id={props.object.id}
        class="bg-red-200 absolute select-none top-0 left-0 __inlens"
        classList={{
          // invisible: isHidden(),
          "__selected-object hover:cursor-grab": props.isSelected,
        }}
        draggable="false"
        onMouseDown={(e) => {
          EventHandlers.onObjectMouseDown(e, props.object);
        }}
        src={props.object.url}
        style={`outline-width: var(--app-border-thickness);
        max-width: none;
      width: ${props.object.width}px;
      height: ${props.object.height}px;
      z-index: ${props.object.zIndex};
      transform:
        translate(${props.object.x}px,
          ${props.object.y}px)`}
      />
    </>
  );
};

export default BaseComponent;
