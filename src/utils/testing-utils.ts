import { nanoid } from "nanoid";
import {
  eImageMotionEffects,
  eObjectType,
  eTextAlign,
  iObject,
} from "../types";
import * as _ from "lodash";
import * as Store from "../store";

export const textObjects = () => {};

export const battlemapTest = () => {
  const newObjects: iObject[] = [
    {
      id: nanoid(),
      x: 100,
      y: 500,
      width: 200,
      height: 200,
      url: "https://i.imgur.com/rzcJEeY.png",
      hasSelfResized: false,
      zIndex: 1,
      type: eObjectType.IMAGE,
      isLocked: false,
    },

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
    },

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
    },
  ];

  Store.setObjects(newObjects);
};
export const makeDummyObjects = (num: number, spacingFactor: number) => {
  const newObjects: { [key: string]: iObject } = {};

  for (let i = 0; i < num; i++) {
    let id = nanoid();

    // @ts-ignore stupid thing cant tell that sample will always return a result?
    newObjects[i] = _.sample([
      // {
      //   id,
      //   x: Math.random() * num * spacingFactor,
      //   y: Math.random() * num * spacingFactor,
      //   width: 200,
      //   height: 50,
      //   zIndex: i,
      //   type: eObjectType.TEXT,
      //   fontSize: 16,
      //   lineHeight: 22,
      //   text: "Proin efficitur, enim laoreet vestibulum accumsan, orci tortor semper orci, nec blandit urna dui nec leo. Nunc imperdiet velit in neque tempus pharetra. Etiam at eros fringilla, convallis erat et, placerat risus. Phasellus venenatis tellus eget nibh lobortis, quis pulvinar risus scelerisque. Suspendisse condimentum risus ac elit fringilla convallis. Aenean urna dui, posuere vel nisi a, gravida iaculis libero. Etiam ornare condimentum tellus sed semper.",

      //   isLocked: false,
      //   textAlign: eTextAlign.LEFT,
      // },
      {
        id,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        // url: `/${_.sample([1, 2, 3, 4, 5, 6, 7])}.jpg`,
        url: "https://i.imgur.com/rzcJEeY.png",
        hasSelfResized: false,
        zIndex: i,
        type: eObjectType.IMAGE,
        // motionEffect: eImageMotionEffects.RAIN,
      },
    ]);
  }

  // newObjects[num + 1] = {
  //   id: nanoid(),
  //   x: Math.random() * num * spacingFactor,
  //   y: Math.random() * num * spacingFactor,
  //   width: 200,
  //   height: 50,
  //   zIndex: num + 1,
  //   type: eObjectType.TEXT,
  //   fontSize: 16,
  //   lineHeight: 22,
  //   text: "Suspendisse vulputate sollicitudin",

  // };

  Store.setObjects(newObjects);
};
