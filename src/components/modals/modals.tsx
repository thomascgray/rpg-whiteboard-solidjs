import { type Component, Switch, Match } from "solid-js";
import * as Store from "../../store";

export const EditImage: Component = (props) => {
  return (
    <>
      <div class="space-y-2">
        <label class="block text-sm font-bold">Object Type</label>
        <select>
          <option value="">Raw Image</option>
          <option value="">Battlemap</option>
          <option value="">Token</option>
        </select>
      </div>
    </>
  );
};
