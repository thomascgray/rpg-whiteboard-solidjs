import { nanoid } from "nanoid";
import { eObjectType, iObject } from "./types";
import * as _ from "lodash";
import * as Store from "./store";

export const makeDummyObjects = (num: number) => {
  const newObjects: { [key: string]: iObject } = {};

  for (let i = 0; i < num; i++) {
    let pos = {
      x: Math.random() * num * 25,
      y: Math.random() * num * 25,
    };
    let id = nanoid();
    newObjects[id] = {
      id,
      pos,
      preDragPos: pos,
      preResizePos: pos,
      url: `/barney${_.sample([1, 2, 3, 4, 5])}.jpg`,
      zIndex: i,
      type: eObjectType.IMAGE,
      isFocused: false,
      dimensions: {
        width: 100,
        height: 100,
      },
      preResizeDimensions: {
        width: 100,
        height: 100,
      },
    };
  }
  Store.setObjects(newObjects);
};
