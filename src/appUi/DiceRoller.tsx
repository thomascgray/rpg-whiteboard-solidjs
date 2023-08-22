import {
  Component,
  createMemo,
  createSignal,
  createEffect,
  onMount,
  For,
} from "solid-js";

import * as _ from "lodash";

const [diceInPool, setDiceInPool] = createSignal<string[]>([]);

const onRoll = () => {
  const elements = document.getElementsByClassName("__dice_in_pool");
  for (let e of elements) {
    const element = e as HTMLElement;
    // start the animation
    element.classList.add("animate-spin-fast");
    setTimeout(
      () => {
        element.classList.remove("animate-spin-fast");
        element.classList.add("animate-bounce-fast");

        setTimeout(() => {
          element.classList.remove("animate-bounce-fast");
        }, 200);
      },
      _.random(500, 1500),
    );
  }
};

export const DieInPool: Component<{ diceSize: string; index: number }> = (
  props,
) => {
  return (
    <button
      onClick={() => {
        setDiceInPool(diceInPool().filter((_, i) => i !== props.index));
      }}
      class="__dice_in_pool h-12 w-12 bg-red-400 text-center text-xl font-bold text-white"
    >
      {props.diceSize}
    </button>
  );
};

export const AddDieToPoolButton: Component<{ diceSize: string }> = (props) => {
  return (
    <button
      onClick={() => {
        setDiceInPool([...diceInPool(), props.diceSize]);
      }}
      class="h-12 w-12 rounded-full bg-blue-500 text-white"
    >
      D{props.diceSize}
    </button>
  );
};

export const DiceRoller: Component = (props) => {
  return (
    <div class="space-y-4">
      <div class="dice-area h-[200px] border border-solid border-slate-400 bg-slate-200">
        <div class="flex h-full items-center justify-around">
          <For each={diceInPool()}>
            {(die, i) => <DieInPool diceSize={die} index={i()} />}
          </For>
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <div class="dice-to-add flex justify-around space-x-2">
          <AddDieToPoolButton diceSize="4" />
          <AddDieToPoolButton diceSize="6" />
          <AddDieToPoolButton diceSize="8" />
          <AddDieToPoolButton diceSize="10" />
          <AddDieToPoolButton diceSize="12" />
          <AddDieToPoolButton diceSize="20" />
        </div>
        <button
          disabled={diceInPool().length <= 0}
          onClick={() => {
            onRoll();
          }}
          class="inline-block rounded-lg bg-red-500 px-3 py-1 text-white disabled:opacity-40"
        >
          Roll
        </button>
      </div>
    </div>
  );
};
