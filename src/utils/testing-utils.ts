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
      '[{"id":"QmjoNucf2Bxvv0nIWi9HD","x":29,"y":50,"width":1552,"height":1039,"url":"https://i.imgur.com/yG5Ld4v.png","hasSelfResized":true,"zIndex":1,"type":"IMAGE","isLocked":false,"isBattlemap":true,"battlemap_gridType":"SQUARES","battlemap_squaresAcross":20,"battlemap_gridColour":"#FFFFFF","battlemap_gridOpacity":0.2,"battlemap_gridLineThickness":2,"battlemap_shouldRenderGrid":true,"battlemap_xOffset":0,"battlemap_yOffset":0,"battlemap_isDynamicLighting":true,"battlemap_isDynamicLightingDarkness":true},{"id":"FHj4HJMYqNjkTwVLosoj0","x":434.021,"y":826.1,"width":32.0625,"height":39.7188,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9eV6sbUwE23wkPffgX0gR2w1WQpedva6JyXFa4vf&s","hasSelfResized":true,"zIndex":2,"type":"IMAGE","isLocked":false,"isBattleToken":true},{"id":"THmJO77SEiTypkHk0wPMs","x":834.218,"y":350.209,"width":37.2969,"height":46.6094,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdF7Q7RYE19uwug5j5_vYMvk2bGSI_hv14MARIiO1&s","hasSelfResized":true,"zIndex":3,"type":"IMAGE","isLocked":false,"isBattleToken":true,"battleToken_autoMeasureMovement":true},{"id":"hzODZ10Bg1GWOqZJc76XN","x":690.24,"y":335.502,"width":20,"height":20,"zIndex":4,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["F_FcLuCFs8CChl5Ay8Ltj"]},{"id":"F_FcLuCFs8CChl5Ay8Ltj","x":700.24,"y":345.502,"width":10.900130518925153,"height":124.31657590350596,"zIndex":5,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":607.002,"y":455.33500000000004},"startAnchorId":"hzODZ10Bg1GWOqZJc76XN","endAnchorId":"W5LWqgwDPCGigAYEPI2rj"},{"id":"W5LWqgwDPCGigAYEPI2rj","x":597.002,"y":445.335,"width":20,"height":20,"zIndex":6,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["F_FcLuCFs8CChl5Ay8Ltj","tKgsggae0_Vy1bJeo7O0D"]},{"id":"tKgsggae0_Vy1bJeo7O0D","x":607.002,"y":455.33500000000004,"width":129.71735901705756,"height":18.101174670327282,"zIndex":7,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":726.72,"y":463.437},"startAnchorId":"W5LWqgwDPCGigAYEPI2rj","endAnchorId":"pZ6efwV1eeIgHxj3N52Xi"},{"id":"pZ6efwV1eeIgHxj3N52Xi","x":716.72,"y":453.437,"width":20,"height":20,"zIndex":8,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["tKgsggae0_Vy1bJeo7O0D","_R9KWad73NmjqS5GchgWO"]},{"id":"_R9KWad73NmjqS5GchgWO","x":726.72,"y":463.437,"width":8.199738962149468,"height":43.30482920023405,"zIndex":9,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":588.424,"y":620.2},"startAnchorId":"pZ6efwV1eeIgHxj3N52Xi","endAnchorId":"872KqSyIHGsq8Ps9Lk8KN"},{"id":"872KqSyIHGsq8Ps9Lk8KN","x":578.424,"y":610.2,"width":20,"height":20,"zIndex":10,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_R9KWad73NmjqS5GchgWO","sVziDhUpUxDf8T7Lumh4z"]},{"id":"sVziDhUpUxDf8T7Lumh4z","x":588.424,"y":620.2,"width":108.81722849813218,"height":15.40078311355137,"zIndex":11,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":376.82,"y":844.15},"startAnchorId":"872KqSyIHGsq8Ps9Lk8KN","endAnchorId":"_FqwYb3xXW-UUVyN5_wHu"},{"id":"_FqwYb3xXW-UUVyN5_wHu","x":366.82,"y":834.15,"width":20,"height":20,"zIndex":12,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["sVziDhUpUxDf8T7Lumh4z","oU67r6ifDzUjqCkBmJkRr"]},{"id":"oU67r6ifDzUjqCkBmJkRr","x":376.82,"y":844.15,"width":10,"height":45.105090238084586,"zIndex":13,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":376.82,"y":879.25},"startAnchorId":"_FqwYb3xXW-UUVyN5_wHu","endAnchorId":"dyni7e2xS5qs9oQLz3Ut4"},{"id":"dyni7e2xS5qs9oQLz3Ut4","x":366.82,"y":869.25,"width":20,"height":20,"zIndex":14,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["oU67r6ifDzUjqCkBmJkRr","nKnBm-fKffZRJ2oBt3KFr"]},{"id":"nKnBm-fKffZRJ2oBt3KFr","x":376.82,"y":879.25,"width":249.4347180341149,"height":5.499347405373783,"zIndex":15,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":616.254,"y":874.75},"startAnchorId":"dyni7e2xS5qs9oQLz3Ut4","endAnchorId":"Uq7i5hYTjzMlTjKf-Nm98"},{"id":"Uq7i5hYTjzMlTjKf-Nm98","x":606.254,"y":864.75,"width":20,"height":20,"zIndex":16,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["nKnBm-fKffZRJ2oBt3KFr","u2mfyRvmRxS53RfE_7Ohc"]},{"id":"u2mfyRvmRxS53RfE_7Ohc","x":616.254,"y":874.75,"width":10,"height":21.50456816238352,"zIndex":17,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":616.254,"y":843.25},"startAnchorId":"Uq7i5hYTjzMlTjKf-Nm98","endAnchorId":"PfyVFzqwtBj26bIrbIeFe"},{"id":"PfyVFzqwtBj26bIrbIeFe","x":606.254,"y":833.25,"width":20,"height":20,"zIndex":18,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["u2mfyRvmRxS53RfE_7Ohc","jyOVmvuRBaSz6YlWnPCfu"]},{"id":"jyOVmvuRBaSz6YlWnPCfu","x":616.254,"y":843.25,"width":71.01174670327191,"height":2.798955848597984,"zIndex":19,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":745.355,"y":637.44},"startAnchorId":"PfyVFzqwtBj26bIrbIeFe","endAnchorId":"DMEKH-pEHUyKqqPGR_Wye"},{"id":"DMEKH-pEHUyKqqPGR_Wye","x":735.355,"y":627.44,"width":20,"height":20,"zIndex":20,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["jyOVmvuRBaSz6YlWnPCfu","GcGcS0ENqSmSkAivM-wVt"]},{"id":"GcGcS0ENqSmSkAivM-wVt","x":745.355,"y":637.44,"width":10.900130518925153,"height":30.50587335163607,"zIndex":21,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":765.425,"y":453.53499999999997},"startAnchorId":"DMEKH-pEHUyKqqPGR_Wye","endAnchorId":"qVb3LPt0Q4VSyfut48jTP"},{"id":"qVb3LPt0Q4VSyfut48jTP","x":755.425,"y":443.535,"width":20,"height":20,"zIndex":22,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["GcGcS0ENqSmSkAivM-wVt","Zjhrlfyh9L9YFNzZk_Ibp"]},{"id":"Zjhrlfyh9L9YFNzZk_Ibp","x":765.425,"y":453.53499999999997,"width":128.81722849813218,"height":14.500652594626331,"zIndex":23,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":884.242,"y":458.03599999999994},"startAnchorId":"qVb3LPt0Q4VSyfut48jTP","endAnchorId":"32Rv0DWSiKKvvZ4vmjP51"},{"id":"32Rv0DWSiKKvvZ4vmjP51","x":874.242,"y":448.036,"width":20,"height":20,"zIndex":24,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Zjhrlfyh9L9YFNzZk_Ibp","BPFfgHQC5pXwpL9AsEQk-"]},{"id":"BPFfgHQC5pXwpL9AsEQk-","x":884.242,"y":458.03599999999994,"width":12.700391556775685,"height":111.51762005490798,"zIndex":25,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":886.943,"y":336.518},"startAnchorId":"32Rv0DWSiKKvvZ4vmjP51","endAnchorId":"FvOfjMnP4iyqaWVnnIfcU"},{"id":"FvOfjMnP4iyqaWVnnIfcU","x":876.943,"y":326.518,"width":20,"height":20,"zIndex":26,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["BPFfgHQC5pXwpL9AsEQk-","2ZgkPMcq_5X3ZG3CH6MVh"]},{"id":"2ZgkPMcq_5X3ZG3CH6MVh","x":886.943,"y":336.518,"width":283.4425491696295,"height":12.700391556775685,"zIndex":27,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":687.639,"y":343.701},"startAnchorId":"FvOfjMnP4iyqaWVnnIfcU","endAnchorId":"gwptqUdJcsXNYIRFVwPHE"},{"id":"gwptqUdJcsXNYIRFVwPHE","x":677.639,"y":333.701,"width":20,"height":20,"zIndex":28,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["2ZgkPMcq_5X3ZG3CH6MVh"]},{"id":"DpUk_xQ2nec_Ak___HvjN","x":642,"y":1136,"width":1552,"height":1039,"url":"https://i.imgur.com/3LEZyfE.png","hasSelfResized":true,"zIndex":29,"type":"IMAGE","isLocked":true,"isBattlemap":true,"battlemap_gridType":"SQUARES","battlemap_squaresAcross":20,"battlemap_gridColour":"#ff0000","battlemap_gridOpacity":0.2,"battlemap_gridLineThickness":2,"battlemap_shouldRenderGrid":false,"battlemap_xOffset":0,"battlemap_yOffset":0,"battlemap_isDynamicLightingDarkness":false,"battlemap_isDynamicLighting":true},{"id":"QUCkQNMhC8vEveB9GfygU","x":1606,"y":-14,"width":1551,"height":1036,"url":"https://i.imgur.com/hkU7qBM.png","hasSelfResized":true,"zIndex":30,"type":"IMAGE","isLocked":true},{"id":"RZsIqmvMfB60h4fle20en","x":1235,"y":1321,"width":20,"height":20,"zIndex":31,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["82f0HdavzfOh6dCe__leh"]},{"id":"82f0HdavzfOh6dCe__leh","x":1245,"y":1331,"width":11,"height":132,"zIndex":32,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1246,"y":1453},"startAnchorId":"RZsIqmvMfB60h4fle20en","endAnchorId":"1ZmSgDhqf7UatJsSmmzcS"},{"id":"1ZmSgDhqf7UatJsSmmzcS","x":1236,"y":1443,"width":20,"height":20,"zIndex":33,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["82f0HdavzfOh6dCe__leh","_XbivYk3_jQp8d0ZT1M0D"]},{"id":"_XbivYk3_jQp8d0ZT1M0D","x":1246,"y":1453,"width":103,"height":10,"zIndex":34,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1339,"y":1453},"startAnchorId":"1ZmSgDhqf7UatJsSmmzcS","endAnchorId":"atmiW7aIzQ2sm5lwRz-AZ"},{"id":"atmiW7aIzQ2sm5lwRz-AZ","x":1329,"y":1443,"width":20,"height":20,"zIndex":35,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_XbivYk3_jQp8d0ZT1M0D","GJ-MF7NIWzUd_8IhRAaFr"]},{"id":"GJ-MF7NIWzUd_8IhRAaFr","x":1339,"y":1453,"width":10,"height":113,"zIndex":36,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1339,"y":1330},"startAnchorId":"atmiW7aIzQ2sm5lwRz-AZ","endAnchorId":"GLXX3rDrJExeGi2gh5K2o"},{"id":"GLXX3rDrJExeGi2gh5K2o","x":1329,"y":1320,"width":20,"height":20,"zIndex":37,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["GJ-MF7NIWzUd_8IhRAaFr","K10VbQ742FLVh5sqP0WCQ"]},{"id":"K10VbQ742FLVh5sqP0WCQ","x":1339,"y":1330,"width":93,"height":14,"zIndex":38,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1236,"y":1334},"startAnchorId":"GLXX3rDrJExeGi2gh5K2o","endAnchorId":"g7lWjhyoUQfr3m5fm8aSb"},{"id":"g7lWjhyoUQfr3m5fm8aSb","x":1226,"y":1324,"width":20,"height":20,"zIndex":39,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["K10VbQ742FLVh5sqP0WCQ"]},{"id":"tezGgLqiquXw_XI8IIAw9","x":1080,"y":1472,"width":20,"height":20,"zIndex":40,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["ngvZvz-_i9MED1IZiIMBN"]},{"id":"ngvZvz-_i9MED1IZiIMBN","x":1090,"y":1482,"width":137,"height":15,"zIndex":41,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1217,"y":1487},"startAnchorId":"tezGgLqiquXw_XI8IIAw9","endAnchorId":"GpZMLYyAeUBbhpJIpl6vY"},{"id":"GpZMLYyAeUBbhpJIpl6vY","x":1207,"y":1477,"width":20,"height":20,"zIndex":42,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["ngvZvz-_i9MED1IZiIMBN","kUT-lCQEgAsaZ9FJ8J_oy"]},{"id":"kUT-lCQEgAsaZ9FJ8J_oy","x":1217,"y":1487,"width":9,"height":71,"zIndex":43,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1216,"y":1548},"startAnchorId":"GpZMLYyAeUBbhpJIpl6vY","endAnchorId":"6ltId3Xj3Utw6G8VpJRG1"},{"id":"6ltId3Xj3Utw6G8VpJRG1","x":1206,"y":1538,"width":20,"height":20,"zIndex":44,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["kUT-lCQEgAsaZ9FJ8J_oy","r38IoERkG34QMCUSycdp2"]},{"id":"r38IoERkG34QMCUSycdp2","x":1216,"y":1548,"width":37,"height":8,"zIndex":45,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1243,"y":1546},"startAnchorId":"6ltId3Xj3Utw6G8VpJRG1","endAnchorId":"Bp1rq3V-HZlTQt24KI6Ge"},{"id":"Bp1rq3V-HZlTQt24KI6Ge","x":1233,"y":1536,"width":20,"height":20,"zIndex":46,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["r38IoERkG34QMCUSycdp2","LOs2OvbVIIYeCQgUs63OZ"]},{"id":"LOs2OvbVIIYeCQgUs63OZ","x":1243,"y":1546,"width":10,"height":56,"zIndex":47,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1243,"y":1480},"startAnchorId":"Bp1rq3V-HZlTQt24KI6Ge","endAnchorId":"NFbbnMEP8bB2U-pHJDHQ2"},{"id":"NFbbnMEP8bB2U-pHJDHQ2","x":1233,"y":1470,"width":20,"height":20,"zIndex":48,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["LOs2OvbVIIYeCQgUs63OZ","oZPjV5PJxwFGKIgCR0fvG"]},{"id":"oZPjV5PJxwFGKIgCR0fvG","x":1243,"y":1480,"width":46,"height":9,"zIndex":49,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1279,"y":1479},"startAnchorId":"NFbbnMEP8bB2U-pHJDHQ2","endAnchorId":"rMHpb4i3KHUrVamiaO3os"},{"id":"rMHpb4i3KHUrVamiaO3os","x":1269,"y":1469,"width":20,"height":20,"zIndex":50,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["oZPjV5PJxwFGKIgCR0fvG","rkJxFK8k_PDUkU-qy9toE"]},{"id":"rkJxFK8k_PDUkU-qy9toE","x":1279,"y":1479,"width":7,"height":26,"zIndex":51,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1276,"y":1443},"startAnchorId":"rMHpb4i3KHUrVamiaO3os","endAnchorId":"YaiagE4L3VuyAP59CJGPj"},{"id":"YaiagE4L3VuyAP59CJGPj","x":1266,"y":1433,"width":20,"height":20,"zIndex":52,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["rkJxFK8k_PDUkU-qy9toE"]},{"id":"X27LZG9a_yUgQ-2uBrtym","x":1299,"y":1433,"width":20,"height":20,"zIndex":53,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Sp-iMajHGNIzc_mZ9eyrY"]},{"id":"Sp-iMajHGNIzc_mZ9eyrY","x":1309,"y":1443,"width":10,"height":52,"zIndex":54,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1309,"y":1485},"startAnchorId":"X27LZG9a_yUgQ-2uBrtym","endAnchorId":"ayssyv8H1nlHmLbdc7fcD"},{"id":"ayssyv8H1nlHmLbdc7fcD","x":1299,"y":1475,"width":20,"height":20,"zIndex":55,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Sp-iMajHGNIzc_mZ9eyrY","1YlgsvmNCa_2y0a-pWVP6"]},{"id":"1YlgsvmNCa_2y0a-pWVP6","x":1309,"y":1485,"width":74,"height":10,"zIndex":56,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1373,"y":1485},"startAnchorId":"ayssyv8H1nlHmLbdc7fcD","endAnchorId":"JdC17FwkoKaOW4qqY1-AN"},{"id":"JdC17FwkoKaOW4qqY1-AN","x":1363,"y":1475,"width":20,"height":20,"zIndex":57,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["1YlgsvmNCa_2y0a-pWVP6","iGShx8ouzOmhghJkl6Z8S"]},{"id":"iGShx8ouzOmhghJkl6Z8S","x":1373,"y":1485,"width":7,"height":70,"zIndex":58,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1370,"y":1545},"startAnchorId":"JdC17FwkoKaOW4qqY1-AN","endAnchorId":"eYlvb3B81xb18hHOZim1a"},{"id":"eYlvb3B81xb18hHOZim1a","x":1360,"y":1535,"width":20,"height":20,"zIndex":59,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["iGShx8ouzOmhghJkl6Z8S","TpmCiQTvHp7tG5AHOcXFq"]},{"id":"TpmCiQTvHp7tG5AHOcXFq","x":1370,"y":1545,"width":99,"height":10,"zIndex":60,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1459,"y":1545},"startAnchorId":"eYlvb3B81xb18hHOZim1a","endAnchorId":"yk3U1qliDpo0LF8NBDXRa"},{"id":"yk3U1qliDpo0LF8NBDXRa","x":1449,"y":1535,"width":20,"height":20,"zIndex":61,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["TpmCiQTvHp7tG5AHOcXFq","sjTqXhVFHIHl-QNjj-8LR"]},{"id":"sjTqXhVFHIHl-QNjj-8LR","x":1459,"y":1545,"width":13,"height":58,"zIndex":62,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1462,"y":1477},"startAnchorId":"yk3U1qliDpo0LF8NBDXRa","endAnchorId":"ULkFLxBVq4NC-lbPlidOa"},{"id":"ULkFLxBVq4NC-lbPlidOa","x":1452,"y":1467,"width":20,"height":20,"zIndex":63,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["sjTqXhVFHIHl-QNjj-8LR","ooa5U48fJJEFq_AkwXAox"]},{"id":"ooa5U48fJJEFq_AkwXAox","x":1462,"y":1477,"width":66,"height":10,"zIndex":64,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1518,"y":1477},"startAnchorId":"ULkFLxBVq4NC-lbPlidOa","endAnchorId":"MEm623Lx3C0-qaydX7ohX"},{"id":"MEm623Lx3C0-qaydX7ohX","x":1508,"y":1467,"width":20,"height":20,"zIndex":65,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["ooa5U48fJJEFq_AkwXAox","WC4WJNczmcwTcCkqJvZnx"]},{"id":"WC4WJNczmcwTcCkqJvZnx","x":1518,"y":1477,"width":15,"height":14,"zIndex":66,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1523,"y":1453},"startAnchorId":"MEm623Lx3C0-qaydX7ohX","endAnchorId":"GvrrPVtyX0cqv7MVwuzlk"},{"id":"GvrrPVtyX0cqv7MVwuzlk","x":1513,"y":1443,"width":20,"height":20,"zIndex":67,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["WC4WJNczmcwTcCkqJvZnx","Xw1qwW42aud5clJcRWEe7"]},{"id":"Xw1qwW42aud5clJcRWEe7","x":1523,"y":1453,"width":18,"height":11,"zIndex":68,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1495,"y":1454},"startAnchorId":"GvrrPVtyX0cqv7MVwuzlk","endAnchorId":"v4N1zofn-3sznXya65BvU"},{"id":"v4N1zofn-3sznXya65BvU","x":1485,"y":1444,"width":20,"height":20,"zIndex":69,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Xw1qwW42aud5clJcRWEe7","_w6BFMVO4w3qr7shiSOf1"]},{"id":"_w6BFMVO4w3qr7shiSOf1","x":1495,"y":1454,"width":7,"height":114,"zIndex":70,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1492,"y":1330},"startAnchorId":"v4N1zofn-3sznXya65BvU","endAnchorId":"5AcNk8r7mZg5f89se912t"},{"id":"5AcNk8r7mZg5f89se912t","x":1482,"y":1320,"width":20,"height":20,"zIndex":71,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_w6BFMVO4w3qr7shiSOf1","SKQR6JTERUlZ6A3QOGz9r"]},{"id":"SKQR6JTERUlZ6A3QOGz9r","x":1492,"y":1330,"width":104,"height":15,"zIndex":72,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1586,"y":1335},"startAnchorId":"5AcNk8r7mZg5f89se912t","endAnchorId":"7RlI5O4D0CxUxXvAgF-Ys"},{"id":"7RlI5O4D0CxUxXvAgF-Ys","x":1576,"y":1325,"width":20,"height":20,"zIndex":73,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["SKQR6JTERUlZ6A3QOGz9r","dB-rjmoYB1wv1ulSdkRTD"]},{"id":"dB-rjmoYB1wv1ulSdkRTD","x":1586,"y":1335,"width":7,"height":127,"zIndex":74,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1583,"y":1452},"startAnchorId":"7RlI5O4D0CxUxXvAgF-Ys","endAnchorId":"_TVO_tWVDyBaErrPOqHYZ"},{"id":"_TVO_tWVDyBaErrPOqHYZ","x":1573,"y":1442,"width":20,"height":20,"zIndex":75,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["dB-rjmoYB1wv1ulSdkRTD","gxWe2Hzif3hrshZftjlTb"]},{"id":"gxWe2Hzif3hrshZftjlTb","x":1583,"y":1452,"width":15,"height":11,"zIndex":76,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1558,"y":1453},"startAnchorId":"_TVO_tWVDyBaErrPOqHYZ","endAnchorId":"Tj8c22iVXEqG2_ysvBmZX"},{"id":"Tj8c22iVXEqG2_ysvBmZX","x":1548,"y":1443,"width":20,"height":20,"zIndex":77,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["gxWe2Hzif3hrshZftjlTb","p86tzGeXHZbkdYMejPamv"]},{"id":"p86tzGeXHZbkdYMejPamv","x":1558,"y":1453,"width":7,"height":31,"zIndex":78,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1555,"y":1474},"startAnchorId":"Tj8c22iVXEqG2_ysvBmZX","endAnchorId":"0dXcGcth9iimAa1q_ullp"},{"id":"0dXcGcth9iimAa1q_ullp","x":1545,"y":1464,"width":20,"height":20,"zIndex":79,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["p86tzGeXHZbkdYMejPamv","uhD02WMaeJSR17NtFPXWu"]},{"id":"uhD02WMaeJSR17NtFPXWu","x":1555,"y":1474,"width":43,"height":19,"zIndex":80,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1588,"y":1483},"startAnchorId":"0dXcGcth9iimAa1q_ullp","endAnchorId":"OvMcpdzlCwIEMABawiXg_"},{"id":"OvMcpdzlCwIEMABawiXg_","x":1578,"y":1473,"width":20,"height":20,"zIndex":81,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["uhD02WMaeJSR17NtFPXWu","WKavelduhw1hhERdL_o5Y"]},{"id":"WKavelduhw1hhERdL_o5Y","x":1588,"y":1483,"width":9,"height":168,"zIndex":82,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1587,"y":1641},"startAnchorId":"OvMcpdzlCwIEMABawiXg_","endAnchorId":"EPZbVBseC5Rn3LZ-PQlMv"},{"id":"EPZbVBseC5Rn3LZ-PQlMv","x":1577,"y":1631,"width":20,"height":20,"zIndex":83,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["WKavelduhw1hhERdL_o5Y","HecNj3ufJ332CMzg6hvoi"]},{"id":"HecNj3ufJ332CMzg6hvoi","x":1587,"y":1641,"width":112,"height":7,"zIndex":84,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1465,"y":1638},"startAnchorId":"EPZbVBseC5Rn3LZ-PQlMv","endAnchorId":"vaSeq5z3YNn4JweQytdur"},{"id":"vaSeq5z3YNn4JweQytdur","x":1455,"y":1628,"width":20,"height":20,"zIndex":85,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["HecNj3ufJ332CMzg6hvoi","tpQZ9nxGMk0PHxvcH6qT1"]},{"id":"tpQZ9nxGMk0PHxvcH6qT1","x":1465,"y":1638,"width":6,"height":50,"zIndex":86,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1461,"y":1578},"startAnchorId":"vaSeq5z3YNn4JweQytdur","endAnchorId":"mdW-ZApoX2V0EBcNdRoBE"},{"id":"mdW-ZApoX2V0EBcNdRoBE","x":1451,"y":1568,"width":20,"height":20,"zIndex":87,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["tpQZ9nxGMk0PHxvcH6qT1","xfpRIdwxoDIqb5OzW9S-7"]},{"id":"xfpRIdwxoDIqb5OzW9S-7","x":1461,"y":1578,"width":78,"height":6,"zIndex":88,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1373,"y":1574},"startAnchorId":"mdW-ZApoX2V0EBcNdRoBE","endAnchorId":"PY4Gm1oHa6SJn6XYfOHkJ"},{"id":"PY4Gm1oHa6SJn6XYfOHkJ","x":1363,"y":1564,"width":20,"height":20,"zIndex":89,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["xfpRIdwxoDIqb5OzW9S-7","XUSl_Kucrx_UHOAI2-vUC"]},{"id":"XUSl_Kucrx_UHOAI2-vUC","x":1373,"y":1574,"width":7,"height":74,"zIndex":90,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1370,"y":1638},"startAnchorId":"PY4Gm1oHa6SJn6XYfOHkJ","endAnchorId":"tyPCCFLSExhO47qhmlX2A"},{"id":"tyPCCFLSExhO47qhmlX2A","x":1360,"y":1628,"width":20,"height":20,"zIndex":91,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["XUSl_Kucrx_UHOAI2-vUC","JKr2dknMQuvIQ4nHsrvLs"]},{"id":"JKr2dknMQuvIQ4nHsrvLs","x":1370,"y":1638,"width":114,"height":12,"zIndex":92,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1246,"y":1640},"startAnchorId":"tyPCCFLSExhO47qhmlX2A","endAnchorId":"elQhNyHvUWo4ZjgKnYokp"},{"id":"elQhNyHvUWo4ZjgKnYokp","x":1236,"y":1630,"width":20,"height":20,"zIndex":93,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["JKr2dknMQuvIQ4nHsrvLs","VpE8t9htRrkIOyAWZXWLb"]},{"id":"VpE8t9htRrkIOyAWZXWLb","x":1246,"y":1640,"width":8,"height":55,"zIndex":94,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1244,"y":1575},"startAnchorId":"elQhNyHvUWo4ZjgKnYokp","endAnchorId":"GgjH9slbiUlvhw677-XYt"},{"id":"GgjH9slbiUlvhw677-XYt","x":1234,"y":1565,"width":20,"height":20,"zIndex":95,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["VpE8t9htRrkIOyAWZXWLb","yDCXe7JvT25LhQHhJZrCl"]},{"id":"yDCXe7JvT25LhQHhJZrCl","x":1244,"y":1575,"width":18,"height":12,"zIndex":96,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1216,"y":1577},"startAnchorId":"GgjH9slbiUlvhw677-XYt","endAnchorId":"AIUPHzqgbZiXT65AuD2DP"},{"id":"AIUPHzqgbZiXT65AuD2DP","x":1206,"y":1567,"width":20,"height":20,"zIndex":97,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["yDCXe7JvT25LhQHhJZrCl","48--x8XL49rFbAqAM4PCz"]},{"id":"48--x8XL49rFbAqAM4PCz","x":1216,"y":1577,"width":11,"height":72,"zIndex":98,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1217,"y":1639},"startAnchorId":"AIUPHzqgbZiXT65AuD2DP","endAnchorId":"MX9N5ynj2kgbUZ866tO1m"},{"id":"MX9N5ynj2kgbUZ866tO1m","x":1207,"y":1629,"width":20,"height":20,"zIndex":99,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["48--x8XL49rFbAqAM4PCz","0VHsq6ah97yRLIjkmCg2D"]},{"id":"0VHsq6ah97yRLIjkmCg2D","x":1217,"y":1639,"width":120,"height":8,"zIndex":100,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1087,"y":1637},"startAnchorId":"MX9N5ynj2kgbUZ866tO1m","endAnchorId":"F-2XSXnK5rNT8cZ8p4P6i"},{"id":"F-2XSXnK5rNT8cZ8p4P6i","x":1077,"y":1627,"width":20,"height":20,"zIndex":101,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["0VHsq6ah97yRLIjkmCg2D","obphg-g2FSD2Yga_QLaIW"]},{"id":"obphg-g2FSD2Yga_QLaIW","x":1087,"y":1637,"width":15,"height":152,"zIndex":102,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1092,"y":1475},"startAnchorId":"F-2XSXnK5rNT8cZ8p4P6i","endAnchorId":"jd-tPlc3MKZIAH2AQWno_"},{"id":"jd-tPlc3MKZIAH2AQWno_","x":1082,"y":1465,"width":20,"height":20,"zIndex":103,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["obphg-g2FSD2Yga_QLaIW"]}]',
    ),
  );
};
