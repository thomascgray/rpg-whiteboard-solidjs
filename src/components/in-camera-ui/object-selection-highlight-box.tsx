import { Component, createMemo, createEffect } from "solid-js";
import * as Store from "../../store";

export const ObjectSelectionHighlightBox: Component = (props) => {
  const selectedObjects = createMemo(() => {
    return Object.values(Store.objects).filter((obj) =>
      Store.selectedObjectIds().includes(obj.id),
    );
  });

  const leftMostXList = createMemo(() => {
    return [
      ...selectedObjects().map((obj) => obj.x),
      ...selectedObjects().map((obj) => obj.wallEndPoint?.x || obj.x),
    ];
  });
  const topMostYList = createMemo(() => {
    return [
      ...selectedObjects().map((obj) => obj.y),
      ...selectedObjects().map((obj) => obj.wallEndPoint?.y || obj.y),
    ];
  });

  const rightMostXList = createMemo(() => {
    return selectedObjects().map(
      (obj) => Math.min(obj.x, obj.wallEndPoint?.x || obj.x) + obj.width,
    );
  });
  const bottomMostYList = createMemo(() => {
    return selectedObjects().map(
      (obj) => Math.min(obj.y, obj.wallEndPoint?.y || obj.y) + obj.height,
    );
  });

  const topLeftX = () => Math.min(...leftMostXList());
  const topLeftY = () => Math.min(...topMostYList());
  const width = () => Math.max(...rightMostXList()) - topLeftX();
  const height = () => Math.max(...bottomMostYList()) - topLeftY();

  createEffect(() => {
    Store.setObjectSelectionBox({
      x: topLeftX(),
      y: topLeftY(),
      width: width(),
      height: height(),
    });
  });
  return (
    <div
      data-pos-x={topLeftX()}
      data-pos-y={topLeftY()}
      data-width={width()}
      data-height={height()}
      id="__object-selection-highlight-box"
      class="pointer-events-none absolute left-0 top-0 outline-dashed outline-offset-1 outline-[#00FFFF]"
      style={`outline-width: var(--app-border-thickness); 
      width: ${width()}px; 
      height: ${height()}px; 
      transform: translate(${topLeftX()}px, 
      ${topLeftY()}px); 
      z-index: 9999999`}
    >
      {/* count of selected objects */}
      {/* <p
        style={`
          font-size: calc(var(--app-font-size) * 0.8);
          padding-left: calc(10px / var(--app-camera-zoom));
          padding-right: calc(10px / var(--app-camera-zoom));
          padding-top: calc(6px / var(--app-camera-zoom));
          padding-bottom: calc(6px / var(--app-camera-zoom));
          height: calc(height: 1.5rem / var(--app-camera-zoom));
          top: calc(-3rem / var(--app-camera-zoom));
        `}
        class="absolute left-0 flex items-center justify-around rounded-full bg-blue-400 text-white"
      >
        <span>{Store.selectedObjectIds().length} selected</span>
      </p> */}
    </div>
  );
};
