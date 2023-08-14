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
          aspectRatio: img.height / img.width,
        });

        // @ts-ignore - manual garbage collection baybee
        img = null;
      };
      img.src = _url;
    }
    return _url;
  });
  //   TODO the onmount image load is causing an infinite loop because we set
  // the objects object signal which means that this component re-renders because
  // its a NEW js object, technically

  // look into how we can get round this
  //   maybe we make each object its OWN signal?

  return (
    <img
      style={`width: ${props.object.dimensions.width}px; height: ${props.object.dimensions.height}px;`}
      class="select-none"
      draggable="false"
      src={props.object.url}
    />
  );
};
