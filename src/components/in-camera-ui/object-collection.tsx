import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../../store";
import BaseObject from "../board-objects/base";

export const ObjectCollection: Component = (props) => {
  return (
    <For each={Store.objects}>
      {(object) => (
        <BaseObject
          object={object}
          isSelected={Store.selectedObjectIds().includes(object.id)}
        />
      )}
    </For>
  );
};
