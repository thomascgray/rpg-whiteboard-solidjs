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
              battlemap_gridType: isAllBattlemap()
                ? undefined
                : eBattlemapGridType.SQUARES,
              battlemap_squaresAcross: isAllBattlemap() ? undefined : 20,
              battlemap_gridColour: isAllBattlemap() ? undefined : "#FFFFFF",
              battlemap_gridOpacity: isAllBattlemap() ? undefined : 0.2,
              battlemap_gridLineThickness: isAllBattlemap() ? undefined : 2,
              battlemap_shouldRenderGrid: isAllBattlemap() ? undefined : true,
              battlemap_xOffset: isAllBattlemap() ? undefined : 0,
              battlemap_yOffset: isAllBattlemap() ? undefined : 0,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />

      <Common.SquareToolbarButton
        icon={<Icons.Swordman />}
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
      <p>Battlemap Settings</p>
      <div class="flex font-poppins text-black">
        <div class="flex w-1/2 flex-col">
          <div class="should-render-grid space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Render Grid
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              checked={
                (Store.so1_prop("battlemap_shouldRenderGrid") as boolean) ||
                false
              }
              onChange={(e) => {
                Store.so_prop_set(
                  "battlemap_shouldRenderGrid",
                  e.currentTarget.checked,
                );
              }}
              type="checkbox"
              class="h-6 w-6"
            />
          </div>

          <div class="grid-colour space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Colour
            </label>
            <input
              value={Store.so1_prop("battlemap_gridColour") as string}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_gridColour",
                  e.currentTarget.value,
                );
              }}
              type="color"
            />
          </div>

          <div class="grid-opacity space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Opacity
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              value={Store.so1_prop("battlemap_gridOpacity") as number}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_gridOpacity",
                  Number(e.currentTarget.value),
                );
              }}
              min={0.1}
              max={1}
              step={0.1}
              type="range"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Line Thickness
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              value={Store.so1_prop("battlemap_gridLineThickness") as number}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_gridLineThickness",
                  Number(e.currentTarget.value),
                );
              }}
              type="range"
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>

        <div class="flex w-1/2 flex-col">
          <div class="grid-type space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Type
            </label>
            <select
              class="w-full px-2 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                Store.so_prop_set("battlemap_gridType", e.currentTarget.value);
              }}
            >
              <option
                selected={
                  Store.so1_prop("battlemap_gridType") ===
                  eBattlemapGridType.SQUARES
                }
                value={eBattlemapGridType.SQUARES}
              >
                Squares
              </option>
              <option
                selected={
                  Store.so1_prop("battlemap_gridType") ===
                  eBattlemapGridType.HEXAGONS_FLAT_TOP
                }
                value={eBattlemapGridType.HEXAGONS_FLAT_TOP}
              >
                Hexes (Flat Top)
              </option>
              <option
                selected={
                  Store.so1_prop("battlemap_gridType") ===
                  eBattlemapGridType.HEXAGONS_POINTY_TOP
                }
                value={eBattlemapGridType.HEXAGONS_POINTY_TOP}
              >
                Hexes (Pointy Top)
              </option>
            </select>
          </div>

          <div class="squares-across space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Squares Across
            </label>
            <input
              class="w-full px-2 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_squaresAcross",
                  Number(e.currentTarget.value),
                );
              }}
              value={
                (Store.so1_prop("battlemap_squaresAcross") as number) || 20
              }
              type="number"
            />
          </div>

          <div class="x-offset space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              X Offset
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              value={(Store.so1_prop("battlemap_xOffset") as number) || 0}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_xOffset",
                  Number(e.currentTarget.value),
                );
              }}
              type="range"
              min={-100}
              max={100}
            />
          </div>

          <div class="y-offset space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Y Offset
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              value={(Store.so1_prop("battlemap_yOffset") as number) || 0}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_yOffset",
                  Number(e.currentTarget.value),
                );
              }}
              min={-100}
              max={100}
              type="range"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const BattleTokenToolbar: Component = (props) => {
  const firstSelectedObjectsGridType = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return undefined;
    const obj = Store.objects.find(
      (obj) => obj.id === Store.selectedObjectIds()[0],
    );
    if (obj === undefined) return undefined;
    return obj.battlemap_gridType;
  });
  const firstSelectedObjectsSquaresAcross = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return undefined;
    const obj = Store.objects.find(
      (obj) => obj.id === Store.selectedObjectIds()[0],
    );
    if (obj === undefined) return undefined;
    return obj.battlemap_squaresAcross;
  });
  return (
    <>
      <p>Battle Token Settings</p>
      <div class="flex font-poppins text-black">
        <div class="flex w-1/2 flex-col">
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
            <label class="block text-sm font-bold text-slate-700">
              Grid Colour
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              type="color"
              // class="h-6 w-6"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Opacity
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              type="color"
              // class="h-6 w-6"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Line Thickness
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              type="range"
              // class="h-6 w-6"
            />
          </div>
        </div>

        <div class="flex w-1/2 flex-col">
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Grid Type
            </label>
            <select
              class="w-full px-2 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                const objs = [...Store.objects];
                Store.selectedObjectIds().forEach((id) => {
                  const obj = Store.objects.find((obj) => obj.id === id);
                  if (obj === undefined) return;
                  const objIndex = Store.objects.findIndex(
                    (obj) => obj.id === id,
                  );
                  objs[objIndex] = {
                    ...obj,
                    battlemap_gridType: e.currentTarget
                      .value as eBattlemapGridType,
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
              class="w-full px-2 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                const objs = [...Store.objects];
                Store.selectedObjectIds().forEach((id) => {
                  const obj = Store.objects.find((obj) => obj.id === id);
                  if (obj === undefined) return;
                  const objIndex = Store.objects.findIndex(
                    (obj) => obj.id === id,
                  );
                  objs[objIndex] = {
                    ...obj,
                    battlemap_squaresAcross: Number(e.currentTarget.value),
                  };
                });
                Store.setObjects(reconcile(objs));
              }}
              value={firstSelectedObjectsSquaresAcross()}
              type="number"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              X Offset
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              type="range"
              // class="h-6 w-6"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              Y Offset
            </label>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              type="range"
              // class="h-6 w-6"
            />
          </div>
        </div>
      </div>
    </>
  );
};
