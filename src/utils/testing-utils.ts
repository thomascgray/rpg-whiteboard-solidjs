import { nanoid } from "nanoid";
import { eObjectType, iObject } from "../types";
import * as _ from "lodash";
import * as Store from "../store";

export const textObjects = () => {};

export const battlemapTest = () => {
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
        x: Math.random() * num * spacingFactor,
        y: Math.random() * num * spacingFactor,
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

export const wallSectionsTest = () => {
  const newObjects: iObject[] = [
    // walls
    {
      id: nanoid(),
      x: 200,
      y: 400,
      width: Math.abs(200 - 500),
      height: Math.abs(400 - 700),
      zIndex: 10,
      type: eObjectType.LINE_OF_SIGHT_WALL,
      wallEndPoint: {
        x: 500,
        y: 700,
      },
      isLocked: false,
    },
    {
      id: nanoid(),
      x: 600,
      y: 1000,
      width: Math.abs(600 - 900),
      height: Math.abs(1000 - 400),
      zIndex: 12,
      type: eObjectType.LINE_OF_SIGHT_WALL,
      wallEndPoint: {
        x: 900,
        y: 400,
      },
      isLocked: false,
    },
  ];

  Store.setObjects(newObjects);
};
