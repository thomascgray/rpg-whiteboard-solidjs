import { Component, createMemo, createEffect, onMount } from "solid-js";

import * as Store from "../../../store";
import {
  eBattlemapGridType,
  eImageMaskShapes,
  eImageMotionEffects,
} from "../../../types";
import * as Icons from "../../icons";
import * as Common from "../../common-components";
import { reconcile } from "solid-js/store";

export const ImageModeSelect: Component = (props) => {
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
              isBattlemap: isAllBattlemap() ? undefined : true,
              gridType: isAllBattlemap()
                ? undefined
                : eBattlemapGridType.SQUARES,
              squaresAcross: isAllBattlemap() ? undefined : 20,
            };
          });
          Store.setObjects(reconcile(objs));
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
  const firstSelectedObjectsGridType = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return undefined;
    const obj = Store.objects.find(
      (obj) => obj.id === Store.selectedObjectIds()[0],
    );
    if (obj === undefined) return undefined;
    return obj.gridType;
  });
  const firstSelectedObjectsSquaresAcross = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return undefined;
    const obj = Store.objects.find(
      (obj) => obj.id === Store.selectedObjectIds()[0],
    );
    if (obj === undefined) return undefined;
    return obj.squaresAcross;
  });
  return (
    <div class="font-poppins flex space-x-4 text-black">
      {/* show the grid */}
      <div class="space-y-1">
        <label class="block text-sm font-bold text-slate-700">
          Render Grid
        </label>
        <input
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="checkbox"
          class="h-6 w-6"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-bold text-slate-700">Grid Type</label>
        <select
          class="px-2 py-1"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onInput={(e) => {
            const objs = [...Store.objects];
            Store.selectedObjectIds().forEach((id) => {
              const obj = Store.objects.find((obj) => obj.id === id);
              if (obj === undefined) return;
              const objIndex = Store.objects.findIndex((obj) => obj.id === id);
              objs[objIndex] = {
                ...obj,
                gridType: e.currentTarget.value as eBattlemapGridType,
              };
            });
            Store.setObjects(reconcile(objs));
          }}
        >
          <option
            selected={
              firstSelectedObjectsGridType() === eBattlemapGridType.SQUARES
            }
            value={eBattlemapGridType.SQUARES}
          >
            Squares
          </option>
          <option
            selected={
              firstSelectedObjectsGridType() ===
              eBattlemapGridType.HEXAGONS_FLAT_TOP
            }
            value={eBattlemapGridType.HEXAGONS_FLAT_TOP}
          >
            Hexes (Flat Top)
          </option>
          <option
            selected={
              firstSelectedObjectsGridType() ===
              eBattlemapGridType.HEXAGONS_POINTY_TOP
            }
            value={eBattlemapGridType.HEXAGONS_POINTY_TOP}
          >
            Hexes (Pointy Top)
          </option>
        </select>
      </div>

      {/* how many squares across */}
      <div class="space-y-1">
        <label class="block text-sm font-bold text-slate-700">
          Squares Across
        </label>
        <input
          class="px-2 py-1"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onInput={(e) => {
            const objs = [...Store.objects];
            Store.selectedObjectIds().forEach((id) => {
              const obj = Store.objects.find((obj) => obj.id === id);
              if (obj === undefined) return;
              const objIndex = Store.objects.findIndex((obj) => obj.id === id);
              objs[objIndex] = {
                ...obj,
                squaresAcross: Number(e.currentTarget.value),
              };
            });
            Store.setObjects(reconcile(objs));
          }}
          value={firstSelectedObjectsSquaresAcross()}
          type="number"
        />
      </div>
    </div>
  );
};
