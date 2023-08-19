import { nanoid } from "nanoid";
import { eObjectType, iObject } from "./types";
import * as _ from "lodash";
import * as Store from "./store";

export const makeDummyObjects = (num: number, spacingFactor: number) => {
  const newObjects: { [key: string]: iObject } = {};

  for (let i = 0; i < num; i++) {
    let id = nanoid();
    newObjects[i] = {
      id,
      x: Math.random() * num * spacingFactor,
      y: Math.random() * num * spacingFactor,
      width: 200,
      height: 200,
      // url: `/${_.sample([1, 2, 3, 4, 5, 6, 7])}.jpg`,
      // hasSelfResized: false,
      zIndex: i,
      type: eObjectType.TEXT,
      text: Math.random().toString(36),
      isFocused: false,
    };
  }

  // for (let i = 0; i < num; i++) {
  //   let id = nanoid();
  //   newObjects[i] = {
  //     id,
  //     x: Math.random() * num * spacingFactor,
  //     y: Math.random() * num * spacingFactor,
  //     width: 200,
  //     height: 200,
  //     url: `/${_.sample([1, 2, 3, 4, 5, 6, 7])}.jpg`,
  //     hasSelfResized: false,
  //     zIndex: i,
  //     type: eObjectType.IMAGE,
  //     isFocused: false,
  //   };
  // }
  Store.setObjects(newObjects);
};
