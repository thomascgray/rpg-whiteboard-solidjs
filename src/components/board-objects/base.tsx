import { Component, Show, createEffect, createMemo, onMount } from "solid-js";
import {
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  iObject,
} from "../../types";
import * as EventHandlers from "../../event-handlers";
import * as Store from "../../store";
import { ImageObject } from "./image";
import * as MotionEffects from "../motion-effect-overlays";
import { TextObject } from "./text";
import { SVGObject } from "./svg";

export interface iBaseObjectProps {
  object: iObject;
  isSelected?: boolean;
}

export const BaseObject: Component<iBaseObjectProps> = (props) => {
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
        <TextObject object={props.object} isSelected={props.isSelected} />
      </Show>

      {/* svg objects */}
      <Show when={props.object.type === eObjectType.SVG}>
        <SVGObject object={props.object} isSelected={props.isSelected} />
      </Show>
    </>
  );
};

export default BaseObject;
