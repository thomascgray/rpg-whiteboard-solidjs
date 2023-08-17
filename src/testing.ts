import { nanoid } from "nanoid";
import { eObjectType, iObject } from "./types";
import * as _ from "lodash";
import * as Store from "./store";

export const makeDummyObjects = (num: number) => {
  const newObjects: { [key: string]: iObject } = {};

  for (let i = 0; i < num; i++) {
    let pos = {
      x: Math.random() * num * 10,
      y: Math.random() * num * 10,
    };
    let id = nanoid();
    newObjects[id] = {
      id,
      pos,
      preDragPos: pos,
      preResizePos: pos,
      url: `/${_.sample([1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])}.png`,
      zIndex: i,
      type: eObjectType.IMAGE,
      isFocused: false,
      dimensions: {
        width: 200,
        height: 200,
      },
      preResizeDimensions: {
        width: 200,
        height: 200,
      },
    };
  }
  Store.setObjects(newObjects);
};
