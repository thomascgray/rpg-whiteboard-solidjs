import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import BaseComponent from "../BaseObject";

export const ObjectCollection: Component = (props) => {
  return (
    <For each={Store.objects}>
      {(object) => (
        <BaseComponent
          object={object}
          isSelected={Store.selectedObjectIds().includes(object.id)}
        />
      )}
    </For>
  );
};
