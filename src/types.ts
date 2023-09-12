// we put a bunch of stuff onto the window object
// its a huge performance gain
declare global {
  interface Window {
    __app_selectedObjects?: NodeListOf<Element>;
    __cameraDom?: HTMLElement;
    __backgroundAppDom?: HTMLElement;
    __setScrollingTimeout?: any;

    __canvasDom?: HTMLElement;
    __canvasContext?: CanvasRenderingContext2D;
    __canvasSvgContext?: any;

    __canvasDrawingTopLeftPoint?: iPoint;
    __canvasDrawingBottomRightPoint?: iPoint;

    __mousePosition?: iPoint;
  }
}

export enum eTool {
  CURSOR = "CURSOR",
  SKETCH = "SKETCH",
  MEASURING = "MEASURING",
  ERASER = "ERASER",
  ADD_INFO_PIN = "ADD_INFO_PIN",
  ADD_LOS_WALL_ANCHOR = "ADD_LOS_WALL_ANCHOR",
  DELETE_LOS_WALL = "DELETE_LOS_WALL",
  ADD_LOS_LIGHT_SOURCE = "ADD_LOS_LIGHT_SOURCE",
}

export enum eMeasuringTools {
  LINE = "LINE",
  CIRCLE = "CIRCLE",
  SQUARE = "SQUARE",
  CONE = "CONE",
}

export enum eLeftTray {
  DICE_ROLLER = "DICE_ROLLER",
  APP_BACKGROUND = "APP_BACKGROUND",
  MUSIC_PLAYER = "MUSIC_PLAYER",
}

export enum eKey {
  SPACE = " ",
  NUMBER_1 = "1",
  NUMBER_2 = "2",
  NUMBER_3 = "3",
  ESCAPE = "Escape",
  SHIFT = "Shift",
  CONTROL = "Control",
  V = "v",
  DELETE = "Delete",
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  TAB = "Tab",
  BACKSPACE = "Backspace",
}

export enum eMouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export enum eObjectType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  SVG = "SVG",
  INFO_PIN = "INFO_PIN",
  LINE_OF_SIGHT_WALL_ANCHOR = "LINE_OF_SIGHT_WALL_ANCHOR",
  LINE_OF_SIGHT_WALL = "LINE_OF_SIGHT_WALL",
  LINE_OF_SIGHT_LIGHT_SOURCE = "LINE_OF_SIGHT_LIGHT_SOURCE",
}

export enum eResizingFrom {
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  MIDDLE_RIGHT = "MIDDLE_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
}

export enum eTextAlign {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
}

export enum eImageMotionEffects {
  RAIN = "RAIN",
}

export enum eImageMaskShapes {
  CIRCLE = "CIRCLE",
}

export enum eModalTypes {
  EDIT_IMAGE = "EDIT_IMAGE",
}

export enum eBattlemapGridType {
  SQUARES = "SQUARES",
  HEXAGONS_FLAT_TOP = "HEXAGONS_FLAT_TOP",
  HEXAGONS_POINTY_TOP = "HEXAGONS_POINTY_TOP",
}

export interface iBoardSettings {
  boardName?: string;
  boardBackgroundColour?: string;
}

export interface iObject {
  id: string;

  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  type: eObjectType;

  isLocked: boolean;

  // for images
  url?: string;
  hasSelfResized?: boolean;
  motionEffect?: eImageMotionEffects;
  maskShape?: eImageMaskShapes;

  // sub stuff of images - battlemap things
  isBattlemap?: boolean;
  battlemap_shouldRenderGrid?: boolean;
  battlemap_gridColour?: string;
  battlemap_gridOpacity?: number;
  battlemap_gridLineThickness?: number;
  battlemap_gridType?: eBattlemapGridType;
  battlemap_squaresAcross?: number;
  battlemap_xOffset?: number;
  battlemap_yOffset?: number;

  battlemap_isDynamicLighting?: boolean;

  // sub stuff for images - battle tokens things
  isBattleToken?: boolean;
  battleToken_autoMeasureMovement?: boolean;

  // for text
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: eTextAlign;

  // for SVG sketches
  svgDataUri?: string;
  originalDimensions?: iDimensions; // because we need the SVG viewbox to always be the original

  // for map markers
  mapMarkerType?: string;
  title?: string;

  // for line of sight wall anchors
  wallObjectIds?: string[]; // these are the walls attached to this anchor point

  // for line of sight walls
  wallEndPoint?: iPoint;
  startAnchorId?: string;
  endAnchorId?: string;
}

export interface iPoint {
  x: number;
  y: number;
}
export interface iDimensions {
  width: number;
  height: number;
}

export interface iBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface iCamera {
  x: number;
  y: number;
  z: number;
}
