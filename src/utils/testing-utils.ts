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
      '[{"id":"QmjoNucf2Bxvv0nIWi9HD","x":29,"y":50,"width":1552,"height":1039,"url":"https://i.imgur.com/yG5Ld4v.png","hasSelfResized":true,"zIndex":1,"type":"IMAGE","isLocked":true,"isBattlemap":true,"battlemap_gridType":"SQUARES","battlemap_squaresAcross":20,"battlemap_gridColour":"#FFFFFF","battlemap_gridOpacity":0.2,"battlemap_gridLineThickness":2,"battlemap_shouldRenderGrid":true,"battlemap_xOffset":0,"battlemap_yOffset":0,"battlemap_isDynamicLighting":true,"battlemap_isDynamicLightingDarkness":true},{"id":"FHj4HJMYqNjkTwVLosoj0","x":327.199,"y":542.623,"width":32.0625,"height":39.7188,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9eV6sbUwE23wkPffgX0gR2w1WQpedva6JyXFa4vf&s","hasSelfResized":true,"zIndex":2,"type":"IMAGE","isLocked":false,"isBattleToken":true},{"id":"THmJO77SEiTypkHk0wPMs","x":837.21,"y":590.132,"width":37.2969,"height":46.6094,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdF7Q7RYE19uwug5j5_vYMvk2bGSI_hv14MARIiO1&s","hasSelfResized":true,"zIndex":3,"type":"IMAGE","isLocked":false,"isBattleToken":true,"battleToken_autoMeasureMovement":true},{"id":"759weyKHXynrAQ8Ymki8R","x":488.33060578512396,"y":439.64464628099176,"width":20,"height":20,"zIndex":4,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["L-ITWSAu41hG6eTqass2w"]},{"id":"L-ITWSAu41hG6eTqass2w","x":498.33060578512396,"y":449.64464628099176,"width":6.694214876033072,"height":109.17355371900828,"zIndex":5,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":495.02482066115704,"y":548.8182},"startAnchorId":"759weyKHXynrAQ8Ymki8R","endAnchorId":"TFo1o8JBYqxKBLhKmTRdm"},{"id":"TFo1o8JBYqxKBLhKmTRdm","x":485.02482066115704,"y":538.8182,"width":20,"height":20,"zIndex":6,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["L-ITWSAu41hG6eTqass2w","niH3ao8pZEJ125Ku02aew"]},{"id":"niH3ao8pZEJ125Ku02aew","x":495.02482066115704,"y":548.8182,"width":21.404958677685954,"height":10,"zIndex":7,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":463.6198619834711,"y":548.8182},"startAnchorId":"TFo1o8JBYqxKBLhKmTRdm","endAnchorId":"c3Qj4cAaSjBurHTO8arsa"},{"id":"c3Qj4cAaSjBurHTO8arsa","x":453.6198619834711,"y":538.8182,"width":20,"height":20,"zIndex":8,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["niH3ao8pZEJ125Ku02aew","W-tMO5A5cWEjCnS7JPAOx"]},{"id":"W-tMO5A5cWEjCnS7JPAOx","x":463.6198619834711,"y":548.8182,"width":10,"height":25.537190082644656,"zIndex":9,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":463.6198619834711,"y":513.2810099173554},"startAnchorId":"c3Qj4cAaSjBurHTO8arsa","endAnchorId":"cQcVTVrHLJCCg1pgupEHn"},{"id":"cQcVTVrHLJCCg1pgupEHn","x":453.6198619834711,"y":503.2810099173554,"width":20,"height":20,"zIndex":10,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["W-tMO5A5cWEjCnS7JPAOx","8GMtxvQNPun45w9TkYKy0"]},{"id":"8GMtxvQNPun45w9TkYKy0","x":463.6198619834711,"y":513.2810099173554,"width":151.15702479338842,"height":12.479338842975153,"zIndex":11,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":302.46283719008267,"y":515.7603487603305},"startAnchorId":"cQcVTVrHLJCCg1pgupEHn","endAnchorId":"cej7qjr7t4gR2PF5fiV1M"},{"id":"cej7qjr7t4gR2PF5fiV1M","x":292.46283719008267,"y":505.76034876033054,"width":20,"height":20,"zIndex":12,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["8GMtxvQNPun45w9TkYKy0","r59Tucb61_EE39TF0-S1j"]},{"id":"r59Tucb61_EE39TF0-S1j","x":302.46283719008267,"y":515.7603487603305,"width":10,"height":108.34710743801656,"zIndex":13,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":302.46283719008267,"y":614.1074561983471},"startAnchorId":"cej7qjr7t4gR2PF5fiV1M","endAnchorId":"znyriIVK8IaDQNE3yK7ar"},{"id":"znyriIVK8IaDQNE3yK7ar","x":292.46283719008267,"y":604.1074561983471,"width":20,"height":20,"zIndex":14,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["r59Tucb61_EE39TF0-S1j","O2VRrqrNbKBZr5T8spukh"]},{"id":"O2VRrqrNbKBZr5T8spukh","x":302.46283719008267,"y":614.1074561983471,"width":173.63636363636363,"height":9.173553719008282,"zIndex":15,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":466.0992008264463,"y":613.2810099173554},"startAnchorId":"znyriIVK8IaDQNE3yK7ar","endAnchorId":"8LkaFdToLrKY_I5COjZCG"},{"id":"8LkaFdToLrKY_I5COjZCG","x":456.0992008264463,"y":603.2810099173554,"width":20,"height":20,"zIndex":16,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["O2VRrqrNbKBZr5T8spukh","Ik6Zl_ctAtzgVwNCojpVd"]},{"id":"Ik6Zl_ctAtzgVwNCojpVd","x":466.0992008264463,"y":613.2810099173554,"width":9.173553719008225,"height":21.404958677685954,"zIndex":17,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":465.2727545454545,"y":581.8760512396694},"startAnchorId":"8LkaFdToLrKY_I5COjZCG","endAnchorId":"DYaqIgYug2oFBepl1OFqx"},{"id":"DYaqIgYug2oFBepl1OFqx","x":455.2727545454545,"y":571.8760512396694,"width":20,"height":20,"zIndex":18,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Ik6Zl_ctAtzgVwNCojpVd","k3RzNo9jrb1T1zZOgTVSB"]},{"id":"k3RzNo9jrb1T1zZOgTVSB","x":465.2727545454545,"y":581.8760512396694,"width":40.57851239669424,"height":10,"zIndex":19,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":495.85126694214875,"y":581.8760512396694},"startAnchorId":"DYaqIgYug2oFBepl1OFqx","endAnchorId":"M4yGwnSGtWIG5ct1lsOhL"},{"id":"M4yGwnSGtWIG5ct1lsOhL","x":485.85126694214875,"y":571.8760512396694,"width":20,"height":20,"zIndex":20,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["k3RzNo9jrb1T1zZOgTVSB","-Nm-rGY1Hk4CO8-8nnHEO"]},{"id":"-Nm-rGY1Hk4CO8-8nnHEO","x":495.85126694214875,"y":581.8760512396694,"width":10.826446280991718,"height":76.11570247933878,"zIndex":21,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":496.6777132231405,"y":647.9917537190082},"startAnchorId":"M4yGwnSGtWIG5ct1lsOhL","endAnchorId":"L_dXvax-s9qdMOd1hPzBg"},{"id":"L_dXvax-s9qdMOd1hPzBg","x":486.6777132231405,"y":637.9917537190082,"width":20,"height":20,"zIndex":22,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["-Nm-rGY1Hk4CO8-8nnHEO","aoRVZ66sZMwnpNs98FJWO"]},{"id":"aoRVZ66sZMwnpNs98FJWO","x":496.6777132231405,"y":647.9917537190082,"width":107.52066115702473,"height":10.826446280991831,"zIndex":23,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":594.1983743801652,"y":648.8182},"startAnchorId":"L_dXvax-s9qdMOd1hPzBg","endAnchorId":"Ikx1p6ZhnMNWDHTcwfnZS"},{"id":"Ikx1p6ZhnMNWDHTcwfnZS","x":584.1983743801652,"y":638.8182,"width":20,"height":20,"zIndex":24,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["aoRVZ66sZMwnpNs98FJWO","APlCDD8peKDl4oLeGqSbp"]},{"id":"APlCDD8peKDl4oLeGqSbp","x":594.1983743801652,"y":648.8182,"width":9.173553719008282,"height":57.76859504132233,"zIndex":25,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":593.3719280991735,"y":581.0496049586777},"startAnchorId":"Ikx1p6ZhnMNWDHTcwfnZS","endAnchorId":"fJSKxvTW9VIUZQA5UVbLD"},{"id":"fJSKxvTW9VIUZQA5UVbLD","x":583.3719280991735,"y":571.0496049586777,"width":20,"height":20,"zIndex":26,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["APlCDD8peKDl4oLeGqSbp","y6Wcz2VvynNS_2N9id6cK"]},{"id":"y6Wcz2VvynNS_2N9id6cK","x":593.3719280991735,"y":581.0496049586777,"width":40.57851239669424,"height":12.479338842975153,"zIndex":27,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":623.9504404958677,"y":583.5289438016529},"startAnchorId":"fJSKxvTW9VIUZQA5UVbLD","endAnchorId":"skQ3simsH0FGThFACROwH"},{"id":"skQ3simsH0FGThFACROwH","x":613.9504404958677,"y":573.5289438016529,"width":20,"height":20,"zIndex":28,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["y6Wcz2VvynNS_2N9id6cK","oy5wLut8fBFh7A4xgCzu4"]},{"id":"oy5wLut8fBFh7A4xgCzu4","x":623.9504404958677,"y":583.5289438016529,"width":13.305785123966984,"height":42.23140495867767,"zIndex":29,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":627.2562256198347,"y":615.7603487603305},"startAnchorId":"skQ3simsH0FGThFACROwH","endAnchorId":"p7YRYtzALee6vs_5uA3Qq"},{"id":"p7YRYtzALee6vs_5uA3Qq","x":617.2562256198347,"y":605.7603487603305,"width":20,"height":20,"zIndex":30,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["oy5wLut8fBFh7A4xgCzu4","k6YC8K640janXlPacGtlD"]},{"id":"k6YC8K640janXlPacGtlD","x":627.2562256198347,"y":615.7603487603305,"width":171.98347107438008,"height":5.867768595041412,"zIndex":31,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":789.2396966942148,"y":611.628117355372},"startAnchorId":"p7YRYtzALee6vs_5uA3Qq","endAnchorId":"JrBSJrY8YzbvFpp3C5Axp"},{"id":"JrBSJrY8YzbvFpp3C5Axp","x":779.2396966942148,"y":601.628117355372,"width":20,"height":20,"zIndex":32,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["k6YC8K640janXlPacGtlD","mDJNYVAN3uU57lovX8nDS"]},{"id":"mDJNYVAN3uU57lovX8nDS","x":789.2396966942148,"y":611.628117355372,"width":7.520661157024733,"height":19.75206611570252,"zIndex":33,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":786.7603578512395,"y":581.8760512396694},"startAnchorId":"JrBSJrY8YzbvFpp3C5Axp","endAnchorId":"gyGYbftVyuompjUHkxfvD"},{"id":"gyGYbftVyuompjUHkxfvD","x":776.7603578512395,"y":571.8760512396694,"width":20,"height":20,"zIndex":34,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["mDJNYVAN3uU57lovX8nDS","dmlpxPCsj4Ia-tATiUn3S"]},{"id":"dmlpxPCsj4Ia-tATiUn3S","x":786.7603578512395,"y":581.8760512396694,"width":41.404958677685954,"height":10.826446280991718,"zIndex":35,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":818.1653165289255,"y":582.7024975206612},"startAnchorId":"gyGYbftVyuompjUHkxfvD","endAnchorId":"Fz-FI2GU2atsJAUmsqgzu"},{"id":"Fz-FI2GU2atsJAUmsqgzu","x":808.1653165289255,"y":572.7024975206612,"width":20,"height":20,"zIndex":36,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["dmlpxPCsj4Ia-tATiUn3S","Yi0LhYYL5D_ia3qnYTmb8"]},{"id":"Yi0LhYYL5D_ia3qnYTmb8","x":818.1653165289255,"y":582.7024975206612,"width":10,"height":75.28925619834706,"zIndex":37,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":818.1653165289255,"y":647.9917537190082},"startAnchorId":"Fz-FI2GU2atsJAUmsqgzu","endAnchorId":"9Ut4W3Ge43_0JS-6TWpz_"},{"id":"9Ut4W3Ge43_0JS-6TWpz_","x":808.1653165289255,"y":637.9917537190082,"width":20,"height":20,"zIndex":38,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Yi0LhYYL5D_ia3qnYTmb8","8hYSrCvcroETNbqme60eM"]},{"id":"8hYSrCvcroETNbqme60eM","x":818.1653165289255,"y":647.9917537190082,"width":175.28925619834706,"height":6.694214876033129,"zIndex":39,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":983.4545727272725,"y":644.6859685950413},"startAnchorId":"9Ut4W3Ge43_0JS-6TWpz_","endAnchorId":"h8RgvqKPuwOCMmyNL5BX4"},{"id":"h8RgvqKPuwOCMmyNL5BX4","x":973.4545727272725,"y":634.6859685950413,"width":20,"height":20,"zIndex":40,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["8hYSrCvcroETNbqme60eM","YC7SYtbjBc8kRQEyMa6Ol"]},{"id":"YC7SYtbjBc8kRQEyMa6Ol","x":983.4545727272725,"y":644.6859685950413,"width":8.347107438016565,"height":86.69421487603302,"zIndex":41,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":981.8016801652891,"y":547.9917537190083},"startAnchorId":"h8RgvqKPuwOCMmyNL5BX4","endAnchorId":"VANTn-OBdOGyMsslrtfGc"},{"id":"VANTn-OBdOGyMsslrtfGc","x":971.8016801652891,"y":537.9917537190083,"width":20,"height":20,"zIndex":42,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["YC7SYtbjBc8kRQEyMa6Ol","sM4-BCj6wJ1V_IQiQsaqk"]},{"id":"sM4-BCj6wJ1V_IQiQsaqk","x":981.8016801652891,"y":547.9917537190083,"width":181.7355371900826,"height":6.694214876033016,"zIndex":43,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":790.0661429752065,"y":544.6859685950413},"startAnchorId":"VANTn-OBdOGyMsslrtfGc","endAnchorId":"u-vQnVYiWkyGMF-i09MNq"},{"id":"u-vQnVYiWkyGMF-i09MNq","x":780.0661429752065,"y":534.6859685950413,"width":20,"height":20,"zIndex":44,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["sM4-BCj6wJ1V_IQiQsaqk","Ezu8eDcwuHT7KYi830bmn"]},{"id":"Ezu8eDcwuHT7KYi830bmn","x":790.0661429752065,"y":544.6859685950413,"width":6.694214876033016,"height":17.272727272727252,"zIndex":45,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":786.7603578512395,"y":517.4132413223141},"startAnchorId":"u-vQnVYiWkyGMF-i09MNq","endAnchorId":"z99f9wiMeELTdXkuWuXok"},{"id":"z99f9wiMeELTdXkuWuXok","x":776.7603578512395,"y":507.4132413223141,"width":20,"height":20,"zIndex":46,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Ezu8eDcwuHT7KYi830bmn","3Lzxgwz9TiVW2GwK0JG-s"]},{"id":"3Lzxgwz9TiVW2GwK0JG-s","x":786.7603578512395,"y":517.4132413223141,"width":87.52066115702473,"height":3.388429752066145,"zIndex":47,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":689.2396966942148,"y":510.80167107438024},"startAnchorId":"z99f9wiMeELTdXkuWuXok","endAnchorId":"KFs96RPwRBeCTdaLRCIkF"},{"id":"KFs96RPwRBeCTdaLRCIkF","x":679.2396966942148,"y":500.80167107438024,"width":20,"height":20,"zIndex":48,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["3Lzxgwz9TiVW2GwK0JG-s","_Riqn3xHqy_Mz8Uw5UCYt"]},{"id":"_Riqn3xHqy_Mz8Uw5UCYt","x":689.2396966942148,"y":510.80167107438024,"width":7.520661157024733,"height":16.44628099173559,"zIndex":49,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":686.7603578512395,"y":484.35539008264465},"startAnchorId":"KFs96RPwRBeCTdaLRCIkF","endAnchorId":"C_X0uTi29u7rQegBrDKQ_"},{"id":"C_X0uTi29u7rQegBrDKQ_","x":676.7603578512395,"y":474.35539008264465,"width":20,"height":20,"zIndex":50,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_Riqn3xHqy_Mz8Uw5UCYt","_vzDbzHgBoikzt6TWqdSH"]},{"id":"_vzDbzHgBoikzt6TWqdSH","x":686.7603578512395,"y":484.35539008264465,"width":81.90082644628103,"height":10,"zIndex":51,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":758.6611842975205,"y":484.35539008264465},"startAnchorId":"C_X0uTi29u7rQegBrDKQ_","endAnchorId":"yjShD8ZbBgtlX18gpnw7W"},{"id":"yjShD8ZbBgtlX18gpnw7W","x":748.6611842975205,"y":474.35539008264465,"width":20,"height":20,"zIndex":52,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["_vzDbzHgBoikzt6TWqdSH","Ca1hV4DAPTbcDzFuUeBUF"]},{"id":"Ca1hV4DAPTbcDzFuUeBUF","x":758.6611842975205,"y":484.35539008264465,"width":8.347107438016565,"height":80.08264462809916,"zIndex":53,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":757.0082917355371,"y":394.2727454545455},"startAnchorId":"yjShD8ZbBgtlX18gpnw7W","endAnchorId":"jMeIX7l-2vQMpD3qyiM5g"},{"id":"jMeIX7l-2vQMpD3qyiM5g","x":747.0082917355371,"y":384.2727454545455,"width":20,"height":20,"zIndex":54,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["Ca1hV4DAPTbcDzFuUeBUF","mx8MkXEhdiPaO3yf0b24t"]},{"id":"mx8MkXEhdiPaO3yf0b24t","x":757.0082917355371,"y":394.2727454545455,"width":36.446280991735534,"height":8.347107438016565,"zIndex":55,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":783.4545727272726,"y":392.61985289256205},"startAnchorId":"jMeIX7l-2vQMpD3qyiM5g","endAnchorId":"cSW_xkMr6V3UO2TwWV-wb"},{"id":"cSW_xkMr6V3UO2TwWV-wb","x":773.4545727272726,"y":382.61985289256205,"width":20,"height":20,"zIndex":56,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["mx8MkXEhdiPaO3yf0b24t","-s8GyTQxL8dMcglO8nTRe"]},{"id":"-s8GyTQxL8dMcglO8nTRe","x":783.4545727272726,"y":392.61985289256205,"width":16.611570247933855,"height":68.6776859504132,"zIndex":57,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":790.0661429752065,"y":451.29753884297526},"startAnchorId":"cSW_xkMr6V3UO2TwWV-wb","endAnchorId":"Jenuaxv-l-Jc0b_cjJ0Cz"},{"id":"Jenuaxv-l-Jc0b_cjJ0Cz","x":780.0661429752065,"y":441.29753884297526,"width":20,"height":20,"zIndex":58,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["-s8GyTQxL8dMcglO8nTRe","dcl9ClOOtyDbw3ewpwqIu"]},{"id":"dcl9ClOOtyDbw3ewpwqIu","x":790.0661429752065,"y":451.29753884297526,"width":171.9834710743802,"height":12.47933884297521,"zIndex":59,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1180.0496140495866,"y":453.77687768595047},"startAnchorId":"Jenuaxv-l-Jc0b_cjJ0Cz","endAnchorId":"GvqEwtheMdqfOVz857xwG"},{"id":"GvqEwtheMdqfOVz857xwG","x":1170.05,"y":443.777,"width":20,"height":20,"zIndex":60,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["dcl9ClOOtyDbw3ewpwqIu","zyE64AWmuaJyBdf46g-O_"]},{"id":"zyE64AWmuaJyBdf46g-O_","x":1180.0496140495866,"y":453.77687768595047,"width":11.652892561983435,"height":157.76859504132233,"zIndex":61,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":1181.7025066115702,"y":286.00828264462814},"startAnchorId":"GvqEwtheMdqfOVz857xwG","endAnchorId":"WMRuNqtL_doRtPXtoIKas"},{"id":"WMRuNqtL_doRtPXtoIKas","x":1171.7,"y":276.008,"width":20,"height":20,"zIndex":62,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["zyE64AWmuaJyBdf46g-O_","fPQFrqpaObewCb_1pDj6O"]},{"id":"fPQFrqpaObewCb_1pDj6O","x":1181.7025066115702,"y":286.00828264462814,"width":156.9421487603306,"height":14.132231404958702,"zIndex":63,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":786.7603578512395,"y":290.14051404958684},"startAnchorId":"WMRuNqtL_doRtPXtoIKas","endAnchorId":"Z0kQ4_IgFoUlf5AvZwg7i"},{"id":"Z0kQ4_IgFoUlf5AvZwg7i","x":776.7603578512395,"y":280.14051404958684,"width":20,"height":20,"zIndex":64,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["fPQFrqpaObewCb_1pDj6O","-0b8R69VPNaZnPNiqRvkS"]},{"id":"-0b8R69VPNaZnPNiqRvkS","x":786.7603578512395,"y":290.14051404958684,"width":10,"height":68.6776859504132,"zIndex":65,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":786.7603578512395,"y":348.81820000000005},"startAnchorId":"Z0kQ4_IgFoUlf5AvZwg7i","endAnchorId":"Fh8rsQEuB1VdD35hzOP9c"},{"id":"Fh8rsQEuB1VdD35hzOP9c","x":776.7603578512395,"y":338.81820000000005,"width":20,"height":20,"zIndex":66,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["-0b8R69VPNaZnPNiqRvkS","q2DzR7H266tK8jWe8wwmW"]},{"id":"q2DzR7H266tK8jWe8wwmW","x":786.7603578512395,"y":348.81820000000005,"width":55.28925619834706,"height":11.652892561983492,"zIndex":67,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":721.4711016528925,"y":350.47109256198354},"startAnchorId":"Fh8rsQEuB1VdD35hzOP9c","endAnchorId":"LUEKQW1c8HC36Ezhap-q0"},{"id":"LUEKQW1c8HC36Ezhap-q0","x":711.4711016528925,"y":340.47109256198354,"width":20,"height":20,"zIndex":68,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["q2DzR7H266tK8jWe8wwmW","0WnRm6QXa_yu9dnIoZMQe"]},{"id":"0WnRm6QXa_yu9dnIoZMQe","x":721.4711016528925,"y":350.47109256198354,"width":8.347107438016565,"height":109.17355371900823,"zIndex":69,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":719.818209090909,"y":449.64464628099176},"startAnchorId":"LUEKQW1c8HC36Ezhap-q0","endAnchorId":"EkgYHzZnCYBxGU7AH88Kt"},{"id":"EkgYHzZnCYBxGU7AH88Kt","x":709.818209090909,"y":439.64464628099176,"width":20,"height":20,"zIndex":70,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["0WnRm6QXa_yu9dnIoZMQe","aB0qhzKrpQcPofdA0I07P"]},{"id":"aB0qhzKrpQcPofdA0I07P","x":719.818209090909,"y":449.64464628099176,"width":55.289256198347175,"height":10.826446280991718,"zIndex":71,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":654.5289528925618,"y":450.4710925619835},"startAnchorId":"EkgYHzZnCYBxGU7AH88Kt","endAnchorId":"rX9DfRu_x5FCrFbjk1sy4"},{"id":"rX9DfRu_x5FCrFbjk1sy4","x":644.5289528925618,"y":440.4710925619835,"width":20,"height":20,"zIndex":72,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["aB0qhzKrpQcPofdA0I07P","vRsjyZmUaEJD1gl9YxFFC"]},{"id":"vRsjyZmUaEJD1gl9YxFFC","x":654.5289528925618,"y":450.4710925619835,"width":7.520661157024847,"height":70.33057851239676,"zIndex":73,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":652.0496140495867,"y":510.80167107438024},"startAnchorId":"rX9DfRu_x5FCrFbjk1sy4","endAnchorId":"uhfsHTonnB5lyZXxbIfKx"},{"id":"uhfsHTonnB5lyZXxbIfKx","x":642.0496140495867,"y":500.80167107438024,"width":20,"height":20,"zIndex":74,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["vRsjyZmUaEJD1gl9YxFFC","u0MPVrDdb8KT7FNn-jcW_"]},{"id":"u0MPVrDdb8KT7FNn-jcW_","x":652.0496140495867,"y":510.80167107438024,"width":17.272727272727252,"height":10.826446280991718,"zIndex":75,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":624.7768867768594,"y":511.62811735537196},"startAnchorId":"uhfsHTonnB5lyZXxbIfKx","endAnchorId":"XKE7uOQpWGQNA42ZBa8aq"},{"id":"XKE7uOQpWGQNA42ZBa8aq","x":614.7768867768594,"y":501.62811735537196,"width":20,"height":20,"zIndex":76,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["u0MPVrDdb8KT7FNn-jcW_","TkfPqO58Ds3jvD_B6m_H1"]},{"id":"TkfPqO58Ds3jvD_B6m_H1","x":624.7768867768594,"y":511.62811735537196,"width":10,"height":48.01652892561981,"zIndex":77,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":624.7768867768594,"y":549.6446462809918},"startAnchorId":"XKE7uOQpWGQNA42ZBa8aq","endAnchorId":"S0KelJnE5Pfm9ocGNqBq2"},{"id":"S0KelJnE5Pfm9ocGNqBq2","x":614.7768867768594,"y":539.6446462809918,"width":20,"height":20,"zIndex":78,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["TkfPqO58Ds3jvD_B6m_H1","xMQLIcQkJW89MyBKCbjGx"]},{"id":"xMQLIcQkJW89MyBKCbjGx","x":624.7768867768594,"y":549.6446462809918,"width":18.09917355371897,"height":8.347107438016565,"zIndex":79,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":596.6777132231405,"y":547.9917537190083},"startAnchorId":"S0KelJnE5Pfm9ocGNqBq2","endAnchorId":"TTSdmU7YwRT2-R0b6CnAm"},{"id":"TTSdmU7YwRT2-R0b6CnAm","x":586.6777132231405,"y":537.9917537190083,"width":20,"height":20,"zIndex":80,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["xMQLIcQkJW89MyBKCbjGx","V5hnkUbx3lZQQXSfIXkaH"]},{"id":"V5hnkUbx3lZQQXSfIXkaH","x":596.6777132231405,"y":547.9917537190083,"width":6.694214876033016,"height":87.52066115702485,"zIndex":81,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":593.3719280991735,"y":450.4710925619835},"startAnchorId":"TTSdmU7YwRT2-R0b6CnAm","endAnchorId":"2F0xSnrhX8wuXKlpCWE_q"},{"id":"2F0xSnrhX8wuXKlpCWE_q","x":583.3719280991735,"y":440.4710925619835,"width":20,"height":20,"zIndex":82,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["V5hnkUbx3lZQQXSfIXkaH","52j8kOBvHvHEc1zekjaA0"]},{"id":"52j8kOBvHvHEc1zekjaA0","x":593.3719280991735,"y":450.4710925619835,"width":94.95867768595036,"height":11.652892561983492,"zIndex":83,"type":"LINE_OF_SIGHT_WALL","isLocked":false,"wallEndPoint":{"x":488.4132504132231,"y":452.123985123967},"startAnchorId":"2F0xSnrhX8wuXKlpCWE_q","endAnchorId":"JxkAXsUKdA-CLj0Lr_mFh"},{"id":"JxkAXsUKdA-CLj0Lr_mFh","x":478.4132504132231,"y":442.123985123967,"width":20,"height":20,"zIndex":84,"type":"LINE_OF_SIGHT_WALL_ANCHOR","isLocked":false,"wallObjectIds":["52j8kOBvHvHEc1zekjaA0"]}]',
    ),
  );
};
