import { type Component, Show, createMemo } from "solid-js";
import * as Store from "../../store";
import { eMeasuringTools, eTool, iPoint } from "../../types";
import * as Utils from "../../utils/general-utils";

// TODO all these components need to take into account
// the camera zoom level for the label and stuff

const calculateTrianglePoints = (
  tip: iPoint,
  midpointBase: iPoint,
  angle: number,
) => {
  const angleInRadians = (angle * Math.PI) / 180;
  // / Calculate the distance between tip and midpointBase
  const height = Math.sqrt(
    Math.pow(midpointBase.x - tip.x, 2) + Math.pow(midpointBase.y - tip.y, 2),
  );

  // Calculate the coordinates of the other two points of the base
  const baseLength = 2 * height * Math.tan(angleInRadians / 2);
  console.log("baseLength", baseLength);
  if (baseLength === 0) {
    return [tip, tip, tip];
  }
  const baseVector = {
    x: midpointBase.x - tip.x,
    y: midpointBase.y - tip.y,
  };
  const perpendicularVector = {
    x: baseVector.y,
    y: -baseVector.x,
  };
  const basePoint1 = {
    x: midpointBase.x + (baseLength / 2) * (perpendicularVector.x / height),
    y: midpointBase.y + (baseLength / 2) * (perpendicularVector.y / height),
  };
  const basePoint2 = {
    x: midpointBase.x - (baseLength / 2) * (perpendicularVector.x / height),
    y: midpointBase.y - (baseLength / 2) * (perpendicularVector.y / height),
  };

  // Return the three points as an array
  return [tip, basePoint1, basePoint2];
};

export const Wrapper: Component = (props) => {
  return (
    <>
      <Show when={Store.selectedMeasuringTool() === eMeasuringTools.LINE}>
        <StraightRule />
      </Show>
      <Show when={Store.selectedMeasuringTool() === eMeasuringTools.CIRCLE}>
        <Circle />
      </Show>
      <Show when={Store.selectedMeasuringTool() === eMeasuringTools.SQUARE}>
        <Square />
      </Show>
      <Show when={Store.selectedMeasuringTool() === eMeasuringTools.CONE}>
        <Cone />
      </Show>
    </>
  );
};

export const DistanceLabel: Component<{ label: string }> = (props) => {
  return (
    <span
      style={`
transform: translate(calc(${
        Store.mousePosMeasuringDistance().x
      }px - 50%), calc(${Store.mousePosMeasuringDistance().y}px - 150%));
      font-size: calc(14px / var(--app-camera-zoom));
      padding-left: calc(0.6em / var(--app-camera-zoom));
      padding-right: calc(0.6em / var(--app-camera-zoom));
      padding-top: calc(0.2em / var(--app-camera-zoom));
      padding-bottom: calc(0.2em / var(--app-camera-zoom));
`}
      class="absolute left-0 top-0 z-[9999999999] rounded-full bg-red-500/50 text-center font-bold text-white"
    >
      {props.label}
    </span>
  );
};

export const StraightRule: Component = (props) => {
  const length = createMemo(() => {
    const originalLength = Math.max(
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().x -
          Store.mousePosMeasuringDistance().x,
      ),
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().y -
          Store.mousePosMeasuringDistance().y,
      ),
    );
    return Math.round(originalLength / Store.measuringScale());
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
            stroke: var(--app-measuring-tool-colour);
            stroke-width: calc(10px / var(--app-camera-zoom));
          `}
        />
      </svg>
      <DistanceLabel label={`${length()} Squares`} />
    </>
  );
};

export const Circle: Component = (props) => {
  const length = createMemo(() => {
    const originalLength = Math.max(
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().x -
          Store.mousePosMeasuringDistance().x,
      ) * 2,
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().y -
          Store.mousePosMeasuringDistance().y,
      ) * 2,
    );

    return Math.round(originalLength / Store.measuringScale());
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
            stroke: var(--app-measuring-tool-colour);
            fill: var(--app-measuring-tool-colour);
            stroke-width: calc(2px / var(--app-camera-zoom));
          `}
        />
      </svg>
      <DistanceLabel label={`${length()} Squares`} />
    </>
  );
};

export const Square: Component = (props) => {
  const length = createMemo(() => {
    const originalLength = Math.max(
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().x -
          Store.mousePosMeasuringDistance().x,
      ) * 2,
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().y -
          Store.mousePosMeasuringDistance().y,
      ) * 2,
    );

    return Math.round(originalLength / Store.measuringScale());
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
  const ratio = () => Math.max(width(), height());
  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <rect
          x={Store.tabKeyMouseDownPosCanvas().x - (ratio() * 2) / 2}
          y={Store.tabKeyMouseDownPosCanvas().y - (ratio() * 2) / 2}
          width={ratio() * 2}
          height={ratio() * 2}
          fill-opacity="20%"
          class="origin-center"
          style={`
            transform-box: fill-box;
            stroke: var(--app-measuring-tool-colour);
            fill: var(--app-measuring-tool-colour);
            stroke-width: calc(3px / var(--app-camera-zoom));
            transform: rotate(${Utils.calculateRotationAngle(
              Store.tabKeyMouseDownPosCanvas(),
              Store.mousePosMeasuringDistance(),
            )}deg);
          `}
        />
      </svg>
      <DistanceLabel label={`${length()} Squares`} />
    </>
  );
};

export const Cone: Component = (props) => {
  const length = createMemo(() => {
    const originalLength = Math.max(
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().x -
          Store.mousePosMeasuringDistance().x,
      ),
      Math.abs(
        Store.tabKeyMouseDownPosCanvas().y -
          Store.mousePosMeasuringDistance().y,
      ),
    );
    return Math.round(originalLength / Store.measuringScale());
  });

  const points = createMemo(() => {
    const points = calculateTrianglePoints(
      Store.tabKeyMouseDownPosCanvas(),
      Store.mousePosMeasuringDistance(),
      53.2,
    );
    return points;
  });

  return (
    <>
      <svg
        class="absolute left-0 top-0 z-[9999999999] overflow-visible"
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <polygon
          points={`
            ${points()[0].x},${points()[0].y}
            ${points()[1].x},${points()[1].y}
            ${points()[2].x},${points()[2].y}
          `}
          fill-opacity="20%"
          class="origin-center"
          style={`
            transform-box: fill-box;
            stroke: var(--app-measuring-tool-colour);
            fill: var(--app-measuring-tool-colour);
            stroke-width: calc(3px / var(--app-camera-zoom));
          `}
        />
      </svg>
      <DistanceLabel label={`${length()} Squares`} />
    </>
  );
};
