import { Component, createMemo } from "solid-js";
import * as Store from "../store";

export const ObjectSelectionHighlightBox: Component = (props) => {
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id),
    );
  });

  const tlXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x);
  });
  const tlYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.y);
  });

  const brXs = createMemo(() => {
    return selectedObjects().map((obj) => obj.x + obj.width);
  });
  const brYs = createMemo(() => {
    return selectedObjects().map((obj) => obj.y + obj.height);
  });

  const topLeftX = () => Math.min(...tlXs());
  const topLeftY = () => Math.min(...tlYs());
  const width = () => Math.max(...brXs()) - topLeftX();
  const height = () => Math.max(...brYs()) - topLeftY();

  return (
    <div
      data-pos-x={topLeftX()}
      data-pos-y={topLeftY()}
      data-width={width()}
      data-height={height()}
      id="__object-selection-highlight-box"
      class="pointer-events-none absolute left-0 top-0 outline-dashed outline-2 outline-offset-1 outline-blue-400"
      style={`outline-width: var(--app-border-thickness); 
      width: ${width()}px; 
      height: ${height()}px; 
      transform: translate(${topLeftX()}px, 
      ${topLeftY()}px); 
      z-index: 9999999`}
    >
      <p
        style="font-size: var(--app-font-size)"
        class="absolute -top-5 left-0 bg-red-500 text-white"
      >
        {Store.selectedObjectIds().length}
      </p>
    </div>
  );
};
