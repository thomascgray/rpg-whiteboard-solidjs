import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../../store";
import { eObjectType, eTextAlign, eTool, iObject } from "../../types";
import * as Icons from "../../components/icons";
import * as Common from "../../components/common-components";
import { reconcile } from "solid-js/store";

export const FontStyleToolbar: Component = (props) => {
  const isAllBold = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBold;
    });
  });

  return (
    <div class="space-x-2 rounded-full border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg">
      <Common.CircleToolbarButton
        icon={<Icons.TypeBold />}
        isActive={isAllBold()}
        title="Select tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isBold: isAllBold() ? false : true,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </div>
  );
};
