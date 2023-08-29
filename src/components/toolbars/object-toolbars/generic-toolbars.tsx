import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../../../store";
import {
  eModalTypes,
  eObjectType,
  eTextAlign,
  eTool,
  iObject,
} from "../../../types";
import * as Icons from "../../icons";
import * as Common from "../../common-components";
import { reconcile } from "solid-js/store";

export const SettingsToolbar: Component = (props) => {
  return (
    <>
      <Common.SquareToolbarButton
        icon={<Icons.GearFill />}
        isActive={false}
        title="Select tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          Store.setCurrentModal(eModalTypes.EDIT_IMAGE);
        }}
      />
    </>
  );
};
