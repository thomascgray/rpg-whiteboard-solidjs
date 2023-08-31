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