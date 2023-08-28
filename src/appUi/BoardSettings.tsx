import {
  Component,
  createMemo,
  createSignal,
  createEffect,
  onMount,
  For,
} from "solid-js";
import * as Store from "../store";
import * as _ from "lodash";

export const BoardSettings: Component = (props) => {
  return (
    <div class="space-y-2">
      <div>
        <label class="block text-black">Board Background Colour</label>
        <input
          value={Store.boardSettings.boardBackgroundColour}
          onInput={(e) => {
            Store.setBoardSettings({
              ...Store.boardSettings,
              boardBackgroundColour: e.currentTarget.value,
            });
          }}
          class="border border-slate-400"
          type="color"
        />
      </div>
      <div>
        <label class="block text-black">Board Name</label>
        <input class="border border-slate-400" type="text" />
      </div>
      <div>
        <label class="block text-black">Board Name</label>
        <input class="border border-slate-400" type="text" />
      </div>
      <div>
        <label class="block text-black">Board Name</label>
        <input class="border border-slate-400" type="text" />
      </div>
    </div>
  );
};
