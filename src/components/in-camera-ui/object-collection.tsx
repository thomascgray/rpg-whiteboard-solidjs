import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../../store";
import BaseObject from "../board-objects/base";
import { eObjectType } from "../../types";

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

export const LineOfSightWallCollection: Component = (props) => {
  return (
    <svg
      width={window.innerWidth}
      height={window.innerHeight}
      class="absolute left-0 top-0 overflow-visible"
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
