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

// TODO all these components need to take into account the camera zoom level

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
  const length = createMemo(() => {
    return Math.sqrt(
      Math.pow(
        Store.mousePosMeasuringDistance().x -
          Store.tabKeyMouseDownPosCanvas().x,
        2,
      ) +
        Math.pow(
          Store.mousePosMeasuringDistance().y -
            Store.tabKeyMouseDownPosCanvas().y,
          2,
        ),
    );
  });
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
          style={`
            stroke: var(--app-active-pen-colour);
            stroke-width:3
          `}
        />
      </svg>
      <p
        style={`
      transform: translate(calc(${
        Store.tabKeyMouseDownPosCanvas().x
      }px - 50%), calc(${Store.tabKeyMouseDownPosCanvas().y}px - 50%));
      `}
        class="absolute left-0 top-0 z-[9999999999] rounded-full bg-red-500 px-4 py-2 text-center text-sm font-bold text-white"
      >
        {length().toFixed(2)}
      </p>
    </>
  );
};

export const Circle: Component = (props) => {
  const length = createMemo(() => {
    return Math.sqrt(
      Math.pow(
        Store.mousePosMeasuringDistance().x -
          Store.tabKeyMouseDownPosCanvas().x,
        2,
      ) +
        Math.pow(
          Store.mousePosMeasuringDistance().y -
            Store.tabKeyMouseDownPosCanvas().y,
          2,
        ),
    );
  });
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
          style={`
            stroke: var(--app-active-pen-colour);
            fill: var(--app-active-pen-colour);
            stroke-width:3
          `}
        />
      </svg>
      <p
        style={`
      transform: translate(calc(${
        Store.tabKeyMouseDownPosCanvas().x
      }px - 50%), calc(${Store.tabKeyMouseDownPosCanvas().y}px - 50%));
      `}
        class="absolute left-0 top-0 z-[9999999999] rounded-full bg-red-500 px-4 py-2 text-center text-sm font-bold text-white"
      >
        {length().toFixed(2)}
      </p>
    </>
  );
};

export const Square: Component = (props) => {
  const length = createMemo(() => {
    return Math.sqrt(
      Math.pow(
        Store.mousePosMeasuringDistance().x -
          Store.tabKeyMouseDownPosCanvas().x,
        2,
      ) +
        Math.pow(
          Store.mousePosMeasuringDistance().y -
            Store.tabKeyMouseDownPosCanvas().y,
          2,
        ),
    );
  });
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
  const ratio = () => Math.min(width(), height());
  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] origin-bottom-right overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <rect
          x={Store.tabKeyMouseDownPosCanvas().x - (ratio() * 2) / 2}
          y={Store.tabKeyMouseDownPosCanvas().y - (ratio() * 2) / 2}
          width={ratio() * 2}
          height={ratio() * 2}
          fill-opacity="20%"
          style={`
            stroke: var(--app-active-pen-colour);
            fill: var(--app-active-pen-colour);
            stroke-width:3
          `}
        />
      </svg>
      <p
        style={`
      transform: translate(calc(${
        Store.tabKeyMouseDownPosCanvas().x
      }px - 50%), calc(${Store.tabKeyMouseDownPosCanvas().y}px - 50%));
      `}
        class="absolute left-0 top-0 z-[9999999999] rounded-full bg-red-500 px-4 py-2 text-center text-sm font-bold text-white"
      >
        {length().toFixed(2)}
      </p>
    </>
  );
};
