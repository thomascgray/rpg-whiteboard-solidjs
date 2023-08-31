import { Component, createMemo, createEffect, onMount } from "solid-js";

import * as Store from "../../../store";
import { eImageMaskShapes, eImageMotionEffects } from "../../../types";
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

  const isAllBattlemap = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBattlemap === true;
    });
  });

  const isAllMaskCircle = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.maskShape === eImageMaskShapes.CIRCLE;
    });
  });

  return (
    <>
      {/* <Common.SquareToolbarButton
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
      /> */}

      <Common.SquareToolbarButton
        icon={<Icons.MapFill />}
        isActive={isAllBattlemap()}
        title="Enable battlemap features"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isBattlemap: obj.isBattlemap ? undefined : true,
            };
          });
          Store.setObjects(reconcile(objs));

          // TODO this is an actual crime against god
          // find someway to make the selected objects toolbar recalculate where it should be without
          // doiung this
          // const el = document.getElementById("__selected-objects-toolbar");
          // // make el invisible
          // el.style.opacity = "0";
          // setTimeout(() => {
          //   Store.setCamera({ ...Store.camera() });
          //   el.style.opacity = "1";
          // }, 1);
        }}
      />

      <Common.SquareToolbarButton
        icon={<Icons.CircleNoFill />}
        isActive={isAllMaskCircle()}
        title="Mask - Circle"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              maskShape: obj.maskShape ? undefined : eImageMaskShapes.CIRCLE,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </>
  );
};

export const BattlemapToolbar: Component = (props) => {
  return (
    <>
      <Common.SquareToolbarButton
        icon={<Icons.BoomboxFill />}
        isActive={false}
        title="Enable battlemap features"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isBattlemap: obj.isBattlemap ? undefined : true,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />

      <Common.SquareToolbarButton
        icon={<Icons.D6_6 />}
        isActive={false}
        title="Mask - Circle"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              maskShape: obj.maskShape ? undefined : eImageMaskShapes.CIRCLE,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
      <Common.SquareToolbarButton
        icon={<Icons.D6_6 />}
        isActive={false}
        title="Mask - Circle"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              maskShape: obj.maskShape ? undefined : eImageMaskShapes.CIRCLE,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
      <Common.SquareToolbarButton
        icon={<Icons.D6_6 />}
        isActive={false}
        title="Mask - Circle"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              maskShape: obj.maskShape ? undefined : eImageMaskShapes.CIRCLE,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </>
  );
};
