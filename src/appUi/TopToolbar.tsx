import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eObjectType, eTool } from "../types";
import * as Icons from "../icons";
import * as Common from "../common-components";
import { nanoid } from "nanoid";
import * as InteractionHandlers from "../interaction-handlers";
import { screenToCanvas } from "../utils/general-utils";
import * as DomUtils from "../utils/dom-utils";

export const TopToolbar: Component = (props) => {
  return (
    <div class="fixed left-[50%] top-3 z-50 flex translate-x-[-50%] flex-row justify-center space-x-2">
      <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
        <Common.CircleToolbarButton
          icon={<Icons.ZoomIn />}
          isActive={false}
          title="Zoom In"
          onMouseDown={() => {
            InteractionHandlers.zoomCamera(
              window.innerWidth / 2,
              window.innerHeight / 2,
              -20,
            );
          }}
        />

        <Common.CircleToolbarButton
          icon={<Icons.ZoomOut />}
          isActive={false}
          title="Zoom Out"
          onMouseDown={() => {
            InteractionHandlers.zoomCamera(
              window.innerWidth / 2,
              window.innerHeight / 2,
              20,
            );
          }}
        />
        <Common.CircleToolbarButton
          icon={<Icons.HouseFill />}
          isActive={false}
          title="Reset Camera"
          onMouseDown={() => {
            // add the transition thing to the camera element, do the move, then remove it

            DomUtils.startCameraAnimating();
            Store.setCamera({
              x: 0,
              y: 0,
              z: 1,
            });

            setTimeout(() => {
              DomUtils.stopCameraAnimating();
            }, 500);
          }}
        />
      </div>
    </div>
  );
};
