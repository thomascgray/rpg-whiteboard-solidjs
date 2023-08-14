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
}

export enum eMouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export enum eObjectType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export enum eResizingFrom {
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
}

export interface iState {
  // 1. we have the actual objects we're rendering on the canvas
  objects: { [key: string]: iObject };

  // 2. we have the keyboard and mouse buttons that the user is pressing
  input: {
    heldMouseButtons: eMouseButton[];
    heldKeys: eKey[];
  };

  // 3. everything else is basically "interaction" state. e.g what objects are selected, is the user dragging, etc.
  // selectedObjectIds: string[];

  isSelectingMultipleObjects: boolean;

  isFocusedInTextbox: boolean;

  isDrawingSelectionBox: boolean;

  drawingSelectionBoxStartPos: iPoint;
  drawingSelectionBoxWidth: number;
  drawingSelectionBoxHeight: number;

  isPanning: boolean;
  camera: iCamera;

  mouseDownPos: iPoint;
  mouseDownPosCanvas: iPoint;

  isResizingFrom: eResizingFrom | null;
}

// export const initialState: iState = {
// 	objects: {},
// 	// selectedObjectIds: [],
// 	isFocusedInTextbox: false,
// 	mouseDownPos: { x: 0, y: 0 },
// 	mouseDownPosCanvas: { x: 0, y: 0 },
// 	isPanning: false,
// 	isDrawingSelectionBox: false,
// 	drawingSelectionBoxStartPos: { x: 0, y: 0 },
// 	drawingSelectionBoxWidth: 0,
// 	drawingSelectionBoxHeight: 0,
// 	isSelectingMultipleObjects: false,
// 	input: {
// 		heldMouseButtons: [],
// 		heldKeys: []
// 	},
// 	camera: {
// 		x: 0,
// 		y: 0,
// 		z: 1
// 	},
// 	isResizingFrom: null
// };

export interface iObject {
  id: string;
  pos: iPoint;
  preDragPos: iPoint;

  dimensions: iDimensions;
  preResizeDimensions: iDimensions;

  zIndex: number;
  type: eObjectType;

  isFocused: boolean;

  // for images
  url?: string;
  aspectRatio?: number;

  // for text
  text?: string;
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
  pos: iPoint;
  dimensions: iDimensions;
}

export interface iCamera {
  x: number;
  y: number;
  z: number;
}
