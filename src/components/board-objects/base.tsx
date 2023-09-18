import { Component, Show } from "solid-js";
import { eObjectType, iObject } from "../../types";
import { ImageObject } from "./image";
import { TextObject } from "./text";
import { SVGObject } from "./svg";
import { InfoPin } from "./info-pin";
import * as LineOfSight from "./line-of-sight-components";

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

      <Show when={props.object.type === eObjectType.INFO_PIN}>
        <InfoPin object={props.object} isSelected={props.isSelected} />
      </Show>

      <Show when={props.object.type === eObjectType.LINE_OF_SIGHT_WALL_ANCHOR}>
        <LineOfSight.WallAnchor
          object={props.object}
          isSelected={props.isSelected}
        />
      </Show>

      <Show when={props.object.type === eObjectType.LINE_OF_SIGHT_WALL}>
        <LineOfSight.Wall object={props.object} isSelected={props.isSelected} />
      </Show>

      <Show when={props.object.type === eObjectType.LINE_OF_SIGHT_LIGHT_SOURCE}>
        <LineOfSight.LightSource
          object={props.object}
          isSelected={props.isSelected}
        />
      </Show>
    </>
  );
};

export default BaseObject;
