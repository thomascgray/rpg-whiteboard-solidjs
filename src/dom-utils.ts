import { iObject } from "./types";
import * as Store from "./store";

// recalculates the position for the object selection box and redraws it manually
export const redrawObjectSelectionBox = () => {
  // const elements = document.getElementsByClassName("__selected-object");
};

export const getAllCurrentlySelectedObjectDOMElements = () => {
  const elements = document.getElementsByClassName("__selected-object");
  return elements;
};

// export const getDOMElementPosDataValues = (element: HTMLElement) => {
//   return [element.dataset.posX, element.dataset.posY];
// };

export const getDOMElementPosStyleValues = (element: HTMLElement) => {
  const transformStyle = getComputedStyle(element).transform;

  if (transformStyle && transformStyle !== "none") {
    const matrix = transformStyle.match(/matrix.*\(([^)]+)\)/)![1].split(",");
    const translateX = parseFloat(matrix[12] || matrix[4]); // Check for WebKit or standard transform
    const translateY = parseFloat(matrix[13] || matrix[5]);
    return [translateX, translateY];
  }

  return [0, 0];
};

export const getDOMElementDimensionsStyleValues = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);

  return [width, height];
};

// sets the transform coords on an element
// and also the data attributes so we can get them back out later
export const setCoordsOnElement = (
  element: HTMLElement,
  x: number,
  y: number
) => {
  element.style.transform = `translate(${x}px, ${y}px)`;
  // element.dataset.posX = `${x}`;
  // element.dataset.posY = `${y}`;
};

export const setCoordsAndDimensionsOnElement = (
  element: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  element.style.transform = `translate(${x}px, ${y}px)`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  // element.dataset.posX = `${x}`;
  // element.dataset.posY = `${y}`;
  // element.dataset.width = `${width}`;
  // element.dataset.height = `${height}`;
};

export const getBottomLeftCoords = (
  elements: HTMLCollectionOf<HTMLElement>
) => {};

export const persistSelectedObjectDOMElementsToState = () => {
  const newObjs: Partial<{ [key: string]: iObject }> = {};
  const selectedObjectDOMElements = getAllCurrentlySelectedObjectDOMElements();

  for (let el of selectedObjectDOMElements) {
    const element = el as HTMLElement;
    const obj = Store.objects[element.id];
    const [x, y] = getDOMElementPosStyleValues(element);
    const [width, height] = getDOMElementDimensionsStyleValues(element);
    const pos: iObject["pos"] = {
      x: +x!,
      y: +y!,
    };
    element.dataset.posX = x.toString();
    element.dataset.posY = y.toString();
    element.dataset.width = width.toString();
    element.dataset.height = height.toString();
    newObjs[element.id] = {
      ...obj,
      pos,
      preDragPos: pos,
      dimensions: {
        width: +width,
        height: +height,
      },
      preResizeDimensions: {
        width: +width,
        height: +height,
      },
    };
  }

  Store.setObjects(newObjs);
};

export const getCameraDomPosStyleValues = () => {
  const cameraDom = document.getElementById("camera");
  const style = window.getComputedStyle(cameraDom!);
  const matrix = style.transform
    .substring(7, style.transform.length - 1)
    .split(",")
    .map((x) => Number(x));

  const [z, , , , x, y] = matrix;
  return [x / z, y / z, z];
};
