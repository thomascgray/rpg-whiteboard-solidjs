import {
  Component,
  createMemo,
  createEffect,
  onMount,
  For,
  createSignal,
  JSX,
} from "solid-js";
import * as Store from "../store";
import * as Icons from "../icons";
import { DiceRoller } from "./DiceRoller";
import { eLeftTray } from "../types";
import * as Common from "../common-components";

export const LeftTray: Component = (props) => {
  return (
    // the tray AND the button bar
    <div
      class="fixed top-[50%] z-50 flex translate-y-[-50%] flex-row items-start justify-center transition-[left]"
      style={`
        left: ${Store.openLeftTray() !== null ? "0px" : `-500px`}
      `}
    >
      {/* the actual tray */}
      <div
        id="tray-without-handle"
        class=" w-[500px] border border-solid border-slate-400 bg-slate-300 p-2 text-white shadow-lg"
      >
        <DiceRoller />
      </div>

      <div class="flex flex-col justify-center">
        <div class="flex -translate-x-1 items-center border border-b-0 border-l-0 border-t-0 border-solid border-slate-400 bg-slate-300 p-2 first:rounded-tr-2xl first:border-t last:rounded-br-2xl last:border-b">
          <Common.CircleToolbarButton
            title="Dice Roller"
            icon={<Icons.D6_6 />}
            isActive={Store.openLeftTray() === eLeftTray.DICE_ROLLER}
            onClick={() => {
              Store.setOpenLeftTray(
                Store.openLeftTray() === eLeftTray.DICE_ROLLER
                  ? null
                  : eLeftTray.DICE_ROLLER,
              );
            }}
          />
        </div>
        <div class="flex -translate-x-1 items-center border border-b-0 border-l-0 border-t-0 border-solid border-slate-400 bg-slate-300 p-2 first:rounded-tr-2xl first:border-t last:rounded-br-2xl last:border-b">
          <Common.CircleToolbarButton
            title="Edit board and screen details"
            icon={<Icons.WindowFullScreen />}
            isActive={Store.openLeftTray() === eLeftTray.APP_BACKGROUND}
            onClick={() => {
              Store.setOpenLeftTray(
                Store.openLeftTray() === eLeftTray.APP_BACKGROUND
                  ? null
                  : eLeftTray.APP_BACKGROUND,
              );
            }}
          />
        </div>

        <div class="flex -translate-x-1 items-center border border-b-0 border-l-0 border-t-0 border-solid border-slate-400 bg-slate-300 p-2 first:rounded-tr-2xl first:border-t last:rounded-br-2xl last:border-b">
          <Common.CircleToolbarButton
            title="Music Player"
            icon={<Icons.BoomboxFill />}
            isActive={Store.openLeftTray() === eLeftTray.MUSIC_PLAYER}
            onClick={() => {
              Store.setOpenLeftTray(
                Store.openLeftTray() === eLeftTray.MUSIC_PLAYER
                  ? null
                  : eLeftTray.MUSIC_PLAYER,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
