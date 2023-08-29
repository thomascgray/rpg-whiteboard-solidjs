import { eObjectType, iObject } from "../types";
import * as Store from "../store";
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

export const getDOMElementFontSizeAndLineHeightStyleValues = (
  element: HTMLElement,
) => {
  const style = getComputedStyle(element);

  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight);

  return [fontSize, lineHeight];
};

// todo this needs to account for scale
export const setStylesOnElement = (
  element: HTMLElement,
  styleAttrs: {
    scale?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    lineHeight?: number;
  },
) => {
  const { scale, x, y, width, height, fontSize, lineHeight } = styleAttrs;
  const styles: Partial<CSSStyleDeclaration> = {};
  if (scale !== undefined && x !== undefined && y !== undefined) {
    styles.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
  } else if (x !== undefined && y !== undefined) {
    styles.transform = `translate(${x}px, ${y}px)`;
  } else if (x !== undefined && y === undefined) {
    styles.transform = `translate(${x}px)`;
  } else if (x === undefined && y !== undefined) {
    styles.transform = `translate(${y}px)`;
  }
  if (width !== undefined) {
    styles.width = `${width}px`;
  }
  if (height !== undefined) {
    styles.height = `${height}px`;
  }
  if (fontSize !== undefined) {
    styles.fontSize = `${fontSize}px`;
  }
  if (lineHeight) {
    styles.lineHeight = `${lineHeight}px`;
  }

  Object.assign(element.style, styles);
};

export const getBottomLeftCoords = (
  elements: HTMLCollectionOf<HTMLElement>,
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

    if (obj.type === eObjectType.TEXT) {
      const [fontSize] = getDOMElementFontSizeAndLineHeightStyleValues(element);

      objs[objIndex] = {
        ...obj,
        x,
        y,
        width,
        height,
        fontSize: fontSize,
      };
    } else {
      objs[objIndex] = {
        ...obj,
        x,
        y,
        width,
        height,
      };
    }
  }
  Store.setObjects(reconcile(objs));
};

export const getCameraDomPosStyleValues = () => {
  // ridiculous string substition method
  const chunks = window.__cameraDom!.style.transform.split(" ");

  const [scale, trans1, trans2] = chunks;
  const z = scale.substring(6, scale.length - 1);
  const x = trans1.substring(10, trans1.length - 3);
  const y = trans2.substring(0, trans2.length - 3);

  return [Number(x), Number(y), Number(z)];
};

export const startCameraAnimating = () => {
  window.__cameraDom!.classList.add("transition-all");
  window.__cameraDom!.classList.add("duration-500");
};

export const stopCameraAnimating = () => {
  window.__cameraDom!.classList.remove("transition-all");
  window.__cameraDom!.classList.remove("duration-500");
};
