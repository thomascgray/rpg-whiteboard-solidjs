import { Component, createMemo, createEffect, onMount } from "solid-js";

import * as Store from "../../store";
import {
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  eTool,
  iObject,
} from "../../types";
import * as Icons from "../../icons";
import * as Common from "../../common-components";
import { reconcile } from "solid-js/store";

export const MotionEffects: Component = (props) => {
  const isAllRain = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.motionEffect === eImageMotionEffects.RAIN;
    });
  });

  return (
    <>
      <Common.SquareToolbarButton
        icon={<Icons.CloudDrizzleFill />}
        isActive={isAllRain()}
        title="Motion Effect - Rain"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              motionEffect: isAllRain() ? undefined : eImageMotionEffects.RAIN,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </>
  );
};
