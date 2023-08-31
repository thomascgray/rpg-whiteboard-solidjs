import {
  type Component,
  onMount,
  For,
  Show,
  onCleanup,
  createMemo,
} from "solid-js";
import * as Store from "../../store";
import { eTool } from "../../types";

export const Wrapper: Component = (props) => {
  return (
    <>
      <Show when={Store.selectedTool() === eTool.MEASURING_LINE}>
        <StraightRule />
      </Show>
      <Show when={Store.selectedTool() === eTool.MEASURING_CIRCLE}>
        <Circle />
      </Show>
      <Show when={Store.selectedTool() === eTool.MEASURING_SQUARE}>
        <Square />
      </Show>
    </>
  );
};
export const StraightRule: Component = (props) => {
  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <line
          x1={Store.tabKeyMouseDownPosCanvas().x}
          y1={Store.tabKeyMouseDownPosCanvas().y}
          x2={Store.mousePosMeasuringDistance().x}
          y2={Store.mousePosMeasuringDistance().y}
          style="stroke:#e74c3c;stroke-width:5"
        />
      </svg>
    </>
  );
};

export const Circle: Component = (props) => {
  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <circle
          cx={Store.tabKeyMouseDownPosCanvas().x}
          cy={Store.tabKeyMouseDownPosCanvas().y}
          r={Math.abs(
            Store.mousePosMeasuringDistance().x -
              Store.tabKeyMouseDownPosCanvas().x,
          )}
          fill-opacity="20%"
          style="stroke:#e74c3c;fill:#e74c3c;stroke-width:5"
        />
      </svg>
    </>
  );
};

export const Square: Component = (props) => {
  const width = createMemo(() => {
    return Math.abs(
      Store.mousePosMeasuringDistance().x - Store.tabKeyMouseDownPosCanvas().x,
    );
  });
  const height = createMemo(() => {
    return Math.abs(
      Store.mousePosMeasuringDistance().y - Store.tabKeyMouseDownPosCanvas().y,
    );
  });
  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <rect
          x={Store.tabKeyMouseDownPosCanvas().x - width() / 2}
          y={Store.tabKeyMouseDownPosCanvas().y - height() / 2}
          width={width() * 1.5}
          height={height() * 1.5}
          fill-opacity="20%"
          style="stroke:#e74c3c;fill:#e74c3c;stroke-width:5"
        />
      </svg>
    </>
  );
};
