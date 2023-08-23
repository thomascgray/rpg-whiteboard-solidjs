import { Component, createMemo, createEffect, onMount, For } from "solid-js";
import * as Store from "../store";
import { eTool } from "../types";
import * as Icons from "../icons";

export const SketchPenNib: Component = (props) => {
  return (
    <span
      style={`
      background-color: ${Store.penColour()};
        width: ${Store.penSize()}px;
        height: ${Store.penSize()}px;
        transform: translate(${
          Store.mousePosSketching().x - Store.penSize() / 2
        }px, ${Store.mousePosSketching().y - Store.penSize() / 2}px);`}
      class="pointer-events-none absolute left-0 top-0 z-20 h-6 w-6 rounded-full "
    ></span>
  );
};
