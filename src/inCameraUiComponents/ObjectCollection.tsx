import { Component, createMemo, createEffect, onMount, For } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../store";
import BaseComponent from "../objectComponents/BaseObject";

export const ObjectCollection: Component = (props) => {
  return (
    <For each={Object.values(Store.objects)}>
      {(object) => (
        <BaseComponent
          object={object}
          isSelected={Store.selectedObjectIds().includes(object.id)}
        />
      )}
    </For>
  );
};
