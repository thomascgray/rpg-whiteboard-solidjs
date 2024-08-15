import { Component, createMemo, createEffect, onMount } from "solid-js";

import * as Store from "../../../store";
import { eBattlemapGridType } from "../../../types";
import * as Icons from "../../icons";
import * as Common from "../../common-components";
import { reconcile } from "solid-js/store";

export const ImageModeSelect: Component = (props) => {
  const isAllBattlemap = createMemo(() => {
    console.log("isAllBattlemap");
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBattlemap === true;
    });
  });

  const isAllBattletoken = createMemo(() => {
    console.log("isAllBattletoken");
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBattleToken === true;
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
        isActive={isAllBattletoken()}
        title="Enable battle token features"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isBattleToken: isAllBattletoken() ? undefined : true,
              battleToken_autoMeasureMovement: isAllBattletoken()
                ? undefined
                : true,
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
        <div class="flex w-1/2 flex-col space-y-2">
          <div class="should-render-grid space-y-1">
            <Common.ToolbarLabel>Render Grid</Common.ToolbarLabel>
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

          <div class="should-render-dynamic-lighting space-y-1">
            <Common.ToolbarLabel>Render Dynamic Lighting</Common.ToolbarLabel>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              checked={
                (Store.so1_prop("battlemap_isDynamicLighting") as boolean) ||
                false
              }
              onChange={(e) => {
                Store.so_prop_set(
                  "battlemap_isDynamicLighting",
                  e.currentTarget.checked,
                );
              }}
              type="checkbox"
              class="h-6 w-6"
            />
          </div>

          <div class="should-render-dynamic-lighting-darkness space-y-1">
            <Common.ToolbarLabel>
              Render Dynamic Lighting Darkness
            </Common.ToolbarLabel>
            <input
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              checked={
                (Store.so1_prop(
                  "battlemap_isDynamicLightingDarkness",
                ) as boolean) || false
              }
              onChange={(e) => {
                Store.so_prop_set(
                  "battlemap_isDynamicLightingDarkness",
                  e.currentTarget.checked,
                );
              }}
              type="checkbox"
              class="h-6 w-6"
            />
          </div>

          <div class="grid-colour space-y-1">
            <Common.ToolbarLabel>Grid Colour</Common.ToolbarLabel>
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
            <Common.ToolbarLabel>Grid Opacity</Common.ToolbarLabel>
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

          <div class="grid-line-thickness space-y-1">
            <Common.ToolbarLabel>Grid Line Thickness</Common.ToolbarLabel>
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

        <div class="flex w-1/2 flex-col space-y-2">
          <div class="grid-type space-y-1">
            <Common.ToolbarLabel>Grid Type</Common.ToolbarLabel>
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
            <Common.ToolbarLabel>Tile Count</Common.ToolbarLabel>
            <input
              class="w-full px-2 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => {
                Store.so_prop_set(
                  "battlemap_squaresAcross",
                  Number(e.currentTarget.value) || 0,
                );
              }}
              value={Store.so1_prop("battlemap_squaresAcross") as number}
              type="number"
            />
          </div>

          <div class="x-offset space-y-1">
            <Common.ToolbarLabel>X Offset</Common.ToolbarLabel>
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
            <Common.ToolbarLabel>Y Offset</Common.ToolbarLabel>
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
  return (
    <>
      <p>Battle Token Settings</p>
      <div class="flex font-poppins text-black">
        <div class="space-y-1">
          <label class="block text-sm text-slate-500">
            Auto-Measure on Battlemaps
          </label>
          <input
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            type="checkbox"
            class="h-6 w-6"
          />
        </div>
      </div>
    </>
  );
};
