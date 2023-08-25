import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export interface iCircleToolbarButtonProps
  extends JSX.HTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  isActive: boolean;
}

export const CircleToolbarButton: Component<iCircleToolbarButtonProps> = (
  props,
) => {
  return (
    <button
      title={props.title}
      // onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      class="rounded-full p-3"
      classList={{
        "bg-slate-400 text-white hover:bg-slate-500": !props.isActive,
        "text-red-500 bg-slate-700": props.isActive,
      }}
    >
      {props.icon}
    </button>
  );
};
