import { Component, createMemo, createEffect, onMount } from "solid-js";
import { iObject } from "../types";
import * as Store from "../store";

export interface ImageProps {
  object: iObject;
}

export const ImageObject: Component<ImageProps> = (props) => {
  // const derivedUrl = () => props.object.url;
  const derivedUrl = createMemo(() => props.object.url);
  const derivedId = createMemo(() => props.object.id);

  createEffect((prev) => {
    const _url = derivedUrl();
    const _id = derivedId();
    if (prev === _url) {
      return;
    }
    if (_url) {
      let img = new Image();
      img.onload = function () {
        Store.setObjects(_id, {
          dimensions: {
            width: img.width,
            height: img.height,
          },
          preResizeDimensions: {
            width: img.width,
            height: img.height,
          },
        });

        // @ts-ignore - manual garbage collection baybee
        img = null;
      };
      img.src = _url;
    }
    return _url;
  });

  return (
    <img
      // style={`width: ${props.object.dimensions.width}px; height: ${props.object.dimensions.height}px;`}
      class="select-none w-full h-full object-contain"
      draggable="false"
      src={props.object.url}
    />
  );
};
