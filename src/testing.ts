import { nanoid } from "nanoid";
import { eObjectType, iObject } from "./types";
import * as _ from "lodash";
import * as Store from "./store";

export const makeDummyObjects = (num: number) => {
  const newObjects: { [key: string]: iObject } = {};

  for (let i = 0; i < num; i++) {
    let id = nanoid();
    newObjects[i] = {
      id,
      x: Math.random() * num * 22,
      y: Math.random() * num * 22,
      width: 200,
      height: 200,
      url: `/${_.sample([1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])}.png`,
      hasSelfResized: false,
      zIndex: i,
      type: eObjectType.IMAGE,
      isFocused: false,
    };
  }
  Store.setObjects(newObjects);
};
