import { type Component, Switch, Match, createMemo } from "solid-js";
import * as Store from "../../store";
import { eModalTypes } from "../../types";
import * as Modals from "./modals";
import * as Icons from "../icons";
import * as Common from "../common-components";

export const ModalWrapper: Component = (props) => {
  const modalTitle = createMemo(() => {
    switch (Store.currentModal()) {
      case eModalTypes.EDIT_IMAGE:
        return "Edit Image";
      default:
        return "Modal";
    }
  });

  return (
    <div
      onMouseDown={(e) => {}}
      id="modal-wrapper"
      class="absolute left-0 top-0 h-screen w-screen bg-slate-800 bg-opacity-60"
    >
      <div
        id="modal-content"
        class="absolute left-[50%] top-[50%] min-w-[30%] max-w-[70%] -translate-x-[50%] -translate-y-[50%] bg-slate-300 px-5 py-5"
      >
        <span class="flex items-center justify-between">
          <span class="text-2xl font-bold">{modalTitle() || "Modal"}</span>
          <Common.CircleToolbarButton
            icon={<Icons.XMark />}
            isActive={false}
            title="Enable Battlemap features"
            onMouseDown={(e) => {
              Store.setCurrentModal(null);
            }}
          />
        </span>

        <Switch>
          <Match when={Store.currentModal() === eModalTypes.EDIT_IMAGE}>
            <Modals.EditImage />
          </Match>
        </Switch>
      </div>
    </div>
  );
};
