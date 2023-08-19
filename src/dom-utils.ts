import { iObject } from "./types";
import * as Store from "./store";
import { reconcile } from "solid-js/store";

// recalculates the position for the object selection box and redraws it manually
export const redrawObjectSelectionBox = () => {
  // const elements = document.getElementsByClassName("__selected-object");
};

export const getAllCurrentlySelectedObjectDOMElements = () => {
  const elements = document.getElementsByClassName("__selected-object");
  return elements;
};

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
export const setCoordsOnElement = (
  element: HTMLElement,
  x: number,
  y: number
) => {
  element.style.transform = `translate(${x}px, ${y}px)`;
};

// sets the transform coords on an element
export const setDimensionOnElement = (
  element: HTMLElement,
  width: number,
  height: number
) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
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
};

export const getBottomLeftCoords = (
  elements: HTMLCollectionOf<HTMLElement>
) => {};

export const persistSelectedObjectDOMElementsToState = () => {
  const selectedObjectDOMElements = getAllCurrentlySelectedObjectDOMElements();

  const objs = [...Store.objects];
  for (let el of selectedObjectDOMElements) {
    const element = el as HTMLElement;
    const obj = Store.objects.find((o) => o.id === element.id)!;
    const objIndex = Store.objects.findIndex((o) => o.id === element.id);

    const [x, y] = getDOMElementPosStyleValues(element);
    const [width, height] = getDOMElementDimensionsStyleValues(element);

    objs[objIndex] = {
      ...obj,
      x,
      y,
      width,
      height,
    };
  }

  // its chuggy when we're moving or resizing like 1000+ plus objects, but
  // at that point... we'll worry about it later
  Store.setObjects(reconcile(objs));
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
