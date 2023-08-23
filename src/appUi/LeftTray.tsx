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

interface iLeftTrayButtonProps {
  icon: JSX.Element;
  titleAttr: string;
  value: eLeftTray;
}
const LeftTrayButton: Component<iLeftTrayButtonProps> = (props) => {
  return (
    <div class="flex -translate-x-1 items-center border border-b-0 border-l-0 border-t-0 border-solid border-slate-400 bg-slate-300 p-2 first:rounded-tr-2xl first:border-t last:rounded-br-2xl last:border-b">
      <button
        title={props.titleAttr}
        onClick={() => {
          if (Store.openLeftTray() === props.value) {
            Store.setOpenLeftTray(null);
          } else {
            Store.setOpenLeftTray(props.value);
          }
        }}
        class="rounded-full p-3"
        classList={{
          "bg-slate-400 text-white hover:bg-slate-500":
            Store.openLeftTray() !== props.value,
          "text-red-500 bg-slate-700": Store.openLeftTray() === props.value,
        }}
      >
        {props.icon}
      </button>
    </div>
  );
};

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
        <LeftTrayButton
          titleAttr="Dice Roller"
          icon={<Icons.D6_6 />}
          value={eLeftTray.DICE_ROLLER}
        />
        <LeftTrayButton
          titleAttr="Edit board and screen details"
          icon={<Icons.WindowFullScreen />}
          value={eLeftTray.APP_BACKGROUND}
        />
        <LeftTrayButton
          titleAttr="Music Player"
          icon={<Icons.BoomboxFill />}
          value={eLeftTray.MUSIC_PLAYER}
        />
      </div>
    </div>
  );
};
