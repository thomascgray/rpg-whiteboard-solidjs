import { nanoid } from "nanoid";
import { eObjectType, iObject } from "../types";
import * as _ from "lodash";
import * as Store from "../store";

/**
 * A bunch of functions that just create objects. Used for testing.
 *
 */

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

export const battlemapTest2 = () => {
  Store.setObjects(
    JSON.parse(
      '[{"id":"QmjoNucf2Bxvv0nIWi9HD","x":100,"y":500,"width":1552,"height":1039,"url":"https://i.imgur.com/yG5Ld4v.png","hasSelfResized":true,"zIndex":1,"type":"IMAGE","isLocked":true,"isBattlemap":true,"battlemap_gridType":"SQUARES","battlemap_squaresAcross":20,"battlemap_gridColour":"#FFFFFF","battlemap_gridOpacity":0.2,"battlemap_gridLineThickness":2,"battlemap_shouldRenderGrid":true,"battlemap_xOffset":0,"battlemap_yOffset":0,"battlemap_isDynamicLighting":true,"battlemap_isDynamicLightingDarkness":true},{"id":"FHj4HJMYqNjkTwVLosoj0","x":505.021,"y":1276.1,"width":32.0625,"height":39.7188,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9eV6sbUwE23wkPffgX0gR2w1WQpedva6JyXFa4vf&s","hasSelfResized":true,"zIndex":2,"type":"IMAGE","isLocked":false,"isBattleToken":true},{"id":"THmJO77SEiTypkHk0wPMs","x":905.218,"y":800.209,"width":37.2969,"height":46.6094,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdF7Q7RYE19uwug5j5_vYMvk2bGSI_hv14MARIiO1&s","hasSelfResized":true,"zIndex":3,"type":"IMAGE","isLocked":false,"isBattleToken":true,"battleToken_autoMeasureMovement":true},{"id":"hzODZ10Bg1GWOqZJc76XN","x":761.24,"y":785.502,"width":20,"height":20,"zIndex":4,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["F_FcLuCFs8CChl5Ay8Ltj"]},{"id":"F_FcLuCFs8CChl5Ay8Ltj","x":771.240415041059,"y":795.5016718098351,"width":10.900130518925153,"height":124.31657590350596,"zIndex":5,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":678.0022249876231,"y":905.3354705432287},"startAnchorId":"hzODZ10Bg1GWOqZJc76XN","endAnchorId":"W5LWqgwDPCGigAYEPI2rj"},{"id":"W5LWqgwDPCGigAYEPI2rj","x":668.0022249876231,"y":895.3354705432287,"width":20,"height":20,"zIndex":6,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["F_FcLuCFs8CChl5Ay8Ltj","tKgsggae0_Vy1bJeo7O0D"]},{"id":"tKgsggae0_Vy1bJeo7O0D","x":678.0022249876231,"y":905.3354705432287,"width":129.71735901705756,"height":18.101174670327282,"zIndex":7,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":797.7195840046807,"y":913.436645213556},"startAnchorId":"W5LWqgwDPCGigAYEPI2rj","endAnchorId":"pZ6efwV1eeIgHxj3N52Xi"},{"id":"pZ6efwV1eeIgHxj3N52Xi","x":787.7195840046807,"y":903.436645213556,"width":20,"height":20,"zIndex":8,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["tKgsggae0_Vy1bJeo7O0D","_R9KWad73NmjqS5GchgWO"]},{"id":"_R9KWad73NmjqS5GchgWO","x":797.7195840046807,"y":913.436645213556,"width":8.199738962149468,"height":43.30482920023405,"zIndex":9,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":659.4240233836603,"y":1070.2027293180674},"startAnchorId":"pZ6efwV1eeIgHxj3N52Xi","endAnchorId":"872KqSyIHGsq8Ps9Lk8KN"},{"id":"872KqSyIHGsq8Ps9Lk8KN","x":649.424,"y":1060.2,"width":20,"height":20,"zIndex":10,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_R9KWad73NmjqS5GchgWO","sVziDhUpUxDf8T7Lumh4z"]},{"id":"sVziDhUpUxDf8T7Lumh4z","x":659.4240233836603,"y":1070.2027293180674,"width":108.81722849813218,"height":15.40078311355137,"zIndex":11,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":447.8204498761569,"y":1294.1513001602675},"startAnchorId":"872KqSyIHGsq8Ps9Lk8KN","endAnchorId":"_FqwYb3xXW-UUVyN5_wHu"},{"id":"_FqwYb3xXW-UUVyN5_wHu","x":437.82,"y":1284.15,"width":20,"height":20,"zIndex":12,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["sVziDhUpUxDf8T7Lumh4z","oU67r6ifDzUjqCkBmJkRr"]},{"id":"oU67r6ifDzUjqCkBmJkRr","x":447.8204498761569,"y":1294.1513001602675,"width":10,"height":45.105090238084586,"zIndex":13,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":447.8204498761569,"y":1329.2513001602676},"startAnchorId":"_FqwYb3xXW-UUVyN5_wHu","endAnchorId":"dyni7e2xS5qs9oQLz3Ut4"},{"id":"dyni7e2xS5qs9oQLz3Ut4","x":437.82,"y":1319.25,"width":20,"height":20,"zIndex":14,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["oU67r6ifDzUjqCkBmJkRr","nKnBm-fKffZRJ2oBt3KFr"]},{"id":"nKnBm-fKffZRJ2oBt3KFr","x":447.8204498761569,"y":1329.2513001602676,"width":249.4347180341149,"height":5.499347405373783,"zIndex":15,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":687.2544498761569,"y":1324.7513001602676},"startAnchorId":"dyni7e2xS5qs9oQLz3Ut4","endAnchorId":"Uq7i5hYTjzMlTjKf-Nm98"},{"id":"Uq7i5hYTjzMlTjKf-Nm98","x":677.254,"y":1314.75,"width":20,"height":20,"zIndex":16,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["nKnBm-fKffZRJ2oBt3KFr","u2mfyRvmRxS53RfE_7Ohc"]},{"id":"u2mfyRvmRxS53RfE_7Ohc","x":687.2544498761569,"y":1324.7513001602676,"width":10,"height":21.50456816238352,"zIndex":17,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":687.2544498761569,"y":1293.2513001602676},"startAnchorId":"Uq7i5hYTjzMlTjKf-Nm98","endAnchorId":"PfyVFzqwtBj26bIrbIeFe"},{"id":"PfyVFzqwtBj26bIrbIeFe","x":677.254,"y":1283.25,"width":20,"height":20,"zIndex":18,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["u2mfyRvmRxS53RfE_7Ohc","jyOVmvuRBaSz6YlWnPCfu"]},{"id":"jyOVmvuRBaSz6YlWnPCfu","x":687.2544498761569,"y":1293.2513001602676,"width":71.01174670327191,"height":2.798955848597984,"zIndex":19,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":816.3547437022313,"y":1087.4402634898506},"startAnchorId":"PfyVFzqwtBj26bIrbIeFe","endAnchorId":"DMEKH-pEHUyKqqPGR_Wye"},{"id":"DMEKH-pEHUyKqqPGR_Wye","x":806.355,"y":1077.44,"width":20,"height":20,"zIndex":20,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["jyOVmvuRBaSz6YlWnPCfu","GcGcS0ENqSmSkAivM-wVt"]},{"id":"GcGcS0ENqSmSkAivM-wVt","x":816.3547437022313,"y":1087.4402634898506,"width":10.900130518925153,"height":30.50587335163607,"zIndex":21,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":836.4251963184661,"y":903.5352095053781},"startAnchorId":"DMEKH-pEHUyKqqPGR_Wye","endAnchorId":"qVb3LPt0Q4VSyfut48jTP"},{"id":"qVb3LPt0Q4VSyfut48jTP","x":826.4251963184661,"y":893.5352095053781,"width":20,"height":20,"zIndex":22,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["GcGcS0ENqSmSkAivM-wVt","Zjhrlfyh9L9YFNzZk_Ibp"]},{"id":"Zjhrlfyh9L9YFNzZk_Ibp","x":836.4251963184661,"y":903.5352095053781,"width":128.81722849813218,"height":14.500652594626331,"zIndex":23,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":955.2424248165983,"y":908.0358621000045},"startAnchorId":"qVb3LPt0Q4VSyfut48jTP","endAnchorId":"32Rv0DWSiKKvvZ4vmjP51"},{"id":"32Rv0DWSiKKvvZ4vmjP51","x":945.2424248165983,"y":898.0358621000045,"width":20,"height":20,"zIndex":24,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Zjhrlfyh9L9YFNzZk_Ibp","BPFfgHQC5pXwpL9AsEQk-"]},{"id":"BPFfgHQC5pXwpL9AsEQk-","x":955.2424248165983,"y":908.0358621000045,"width":12.700391556775685,"height":111.51762005490798,"zIndex":25,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":957.942816373374,"y":786.5182420450965},"startAnchorId":"32Rv0DWSiKKvvZ4vmjP51","endAnchorId":"FvOfjMnP4iyqaWVnnIfcU"},{"id":"FvOfjMnP4iyqaWVnnIfcU","x":947.942816373374,"y":776.5182420450965,"width":20,"height":20,"zIndex":26,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["BPFfgHQC5pXwpL9AsEQk-","2ZgkPMcq_5X3ZG3CH6MVh"]},{"id":"2ZgkPMcq_5X3ZG3CH6MVh","x":957.942816373374,"y":786.5182420450965,"width":283.4425491696295,"height":12.700391556775685,"zIndex":27,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":758.6385877761055,"y":793.7014107719846},"startAnchorId":"FvOfjMnP4iyqaWVnnIfcU","endAnchorId":"gwptqUdJcsXNYIRFVwPHE"},{"id":"gwptqUdJcsXNYIRFVwPHE","x":748.639,"y":783.701,"width":20,"height":20,"zIndex":28,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["2ZgkPMcq_5X3ZG3CH6MVh"]}]',
    ),
  );
};
