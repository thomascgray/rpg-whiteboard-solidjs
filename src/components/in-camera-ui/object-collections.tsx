import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import { Portal } from "solid-js/web";
import * as Store from "../../store";
import BaseObject from "../board-objects/base";
import { eObjectType, eTool } from "../../types";

/**
 * All of the objects that AREN'T line of sight walls
 */
export const ObjectCollection: Component = (props) => {
  return (
    <For
      each={Store.objects.filter(
        (o) => o.type !== eObjectType.LINE_OF_SIGHT_WALL,
      )}
    >
      {(object) => (
        <BaseObject
          object={object}
          isSelected={Store.selectedObjectIds().includes(object.id)}
        />
      )}
    </For>
  );
};

/**
 * All of the line of sight wall objects.
 *
 * This is a separate component because we want to specifically render the line of sight walls all inside the same svg dom element.
 */
export const LineOfSightWallCollection: Component = (props) => {
  return (
    <svg
      // this is a very cheeky hack - by making the parent SVG to all the lines the size of the screen, it makes doing a bunch of calculations much easier
      width={window.innerWidth}
      height={window.innerHeight}
      class="absolute left-0 top-0 z-[9999999] overflow-visible"
      // you can only interact with the line of sight walls if you've got the right tool selected
      classList={{
        "pointer-events-none":
          Store.selectedTool() !== eTool.ADD_LOS_WALL_ANCHOR &&
          Store.selectedTool() !== eTool.DELETE_LOS_WALL,
      }}
      onMouseDown={(e) => {
        console.log("onmousedown svg line of sight wall collection");
        return;
      }}
    >
      <For
        each={Store.objects.filter(
          (o) => o.type === eObjectType.LINE_OF_SIGHT_WALL,
        )}
      >
        {(object) => (
          <BaseObject
            object={object}
            isSelected={Store.selectedObjectIds().includes(object.id)}
          />
        )}
      </For>
    </svg>
  );
};