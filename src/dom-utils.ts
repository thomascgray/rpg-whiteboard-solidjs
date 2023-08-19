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

export const setStylesOnElement = (
  element: HTMLElement,
  styleAttrs: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    lineHeight?: number;
  }
) => {
  const { x, y, width, height, fontSize, lineHeight } = styleAttrs;
  const styles: Partial<CSSStyleDeclaration> = {};
  console.log("styleAttrs", JSON.stringify(styleAttrs, null, 2));
  if (x && y) {
    styles.transform = `translate(${x}px, ${y}px)`;
  } else if (x && !y) {
    styles.transform = `translate(${x}px)`;
  } else if (!x && y) {
    styles.transform = `translateY(${y}px)`;
  }
  if (width) {
    styles.width = `${width}px`;
  }
  if (height) {
    styles.height = `${height}px`;
  }
  if (fontSize) {
    styles.fontSize = `${fontSize}px`;
  }
  if (lineHeight) {
    styles.lineHeight = `${lineHeight}px`;
  }

  Object.assign(element.style, styles);
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
