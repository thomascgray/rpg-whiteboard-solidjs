import { nanoid } from "nanoid";
import { eObjectType, iObject } from "../types";
import * as _ from "lodash";
import * as Store from "../store";

/**
 * A bunch of functions that just create objects. Used for testing.
 *
 */

export const battlemapTestA = () => {
  const newObjects: iObject[] = [
    // battlemap
    {
      id: nanoid(),
      x: 100,
      y: 500,
      width: 200,
      height: 200,
      url: "https://i.imgur.com/ifmUwsS.png",
      hasSelfResized: false,
      zIndex: 1,
      type: eObjectType.IMAGE,
      isLocked: true,
    },

    // token 1
    {
      id: nanoid(),
      x: 200,
      y: 700,
      width: 200,
      height: 200,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9eV6sbUwE23wkPffgX0gR2w1WQpedva6JyXFa4vf&s",
      hasSelfResized: false,
      zIndex: 2,
      type: eObjectType.IMAGE,
      isLocked: false,
      isBattleToken: true,
    },

    // token 2
    {
      id: nanoid(),
      x: 200,
      y: 900,
      width: 200,
      height: 200,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdF7Q7RYE19uwug5j5_vYMvk2bGSI_hv14MARIiO1&s",
      hasSelfResized: false,
      zIndex: 3,
      type: eObjectType.IMAGE,
      isLocked: false,
      isBattleToken: true,
    },
  ];

  Store.setObjects(newObjects);
};

export const _200ImagesNotOverlapping = () => {
  const newObjects: { [key: string]: iObject } = {};
  let num = 200;
  let rowLength = 20;
  for (let i = 0; i < num; i++) {
    let id = nanoid();

    // @ts-ignore stupid thing cant tell that sample will always return a result?
    newObjects[i] = _.sample([
      {
        id,

        y: Math.floor(i / rowLength) * 895 + Math.floor(i / rowLength) * 10,
        x: (i % rowLength) * 757 + (i % rowLength) * 10,

        width: 757,
        height: 895,
        url: "https://i.imgur.com/S4U7Gpx.png",
        hasSelfResized: false,
        zIndex: i,
        type: eObjectType.IMAGE,
      },
    ]);
  }
  Store.setObjects(newObjects);
};

export const _2000ImagesNotOverlapping = () => {
  const newObjects: { [key: string]: iObject } = {};
  let num = 2000;
  let rowLength = 20;
  for (let i = 0; i < num; i++) {
    let id = nanoid();

    // @ts-ignore stupid thing cant tell that sample will always return a result?
    newObjects[i] = _.sample([
      {
        id,

        y: Math.floor(i / rowLength) * 895 + Math.floor(i / rowLength) * 10,
        x: (i % rowLength) * 757 + (i % rowLength) * 10,

        width: 757,
        height: 895,
        url: "https://i.imgur.com/S4U7Gpx.png",
        hasSelfResized: false,
        zIndex: i,
        type: eObjectType.IMAGE,
      },
    ]);
  }
  Store.setObjects(newObjects);
};

export const _200ImagesOverlapping = () => {
  const newObjects: { [key: string]: iObject } = {};
  let num = 200;
  let rowLength = 20;
  for (let i = 0; i < num; i++) {
    let id = nanoid();

    // @ts-ignore stupid thing cant tell that sample will always return a result?
    newObjects[i] = _.sample([
      {
        id,

        y: 100,
        x: 100,

        width: 757,
        height: 895,
        url: "https://www.gstatic.com/webp/gallery/1.webp",
        hasSelfResized: false,
        zIndex: i,
        type: eObjectType.IMAGE,
      },
    ]);
  }
  Store.setObjects(newObjects);
};
