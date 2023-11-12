import { eObjectType, iObject } from "../types";
import * as Store from "../store";
import { reconcile } from "solid-js/store";

/**
 * Get the point data for an element, sourced from the elements DOM.
 *
 * For line of sight walls, this is the x1, y1, x2, y2 values for the SVG line itself.
 *
 * For everything else, this is the translateX and translateY values for the element.
 */
export const getElementPointData = (
  element: HTMLElement,
): [number, number] | [number, number, number, number] => {
  switch (element.dataset.type) {
    case eObjectType.LINE_OF_SIGHT_WALL:
      return [
        // @ts-ignore
        element.x1.baseVal.value,
        // @ts-ignore
        element.y1.baseVal.value,
        // @ts-ignore
        element.x2.baseVal.value,
        // @ts-ignore
        element.y2.baseVal.value,
      ];

    default:
      const transformStyle = getComputedStyle(element).transform;

      if (transformStyle && transformStyle !== "none") {
        const matrix = transformStyle
          .match(/matrix.*\(([^)]+)\)/)![1]
          .split(",");
        const translateX = parseFloat(matrix[12] || matrix[4]); // Check for WebKit or standard transform
        const translateY = parseFloat(matrix[13] || matrix[5]);
        return [translateX, translateY];
      }

      return [0, 0];
  }
};

/**
 * Gets an elements width and height data, taken from the style.width and style.height attrs of the element.
 *
 * @returns [width, height]
 */
export const getElementDimensionData = (
  element: HTMLElement,
): [number, number] => {
  const style = getComputedStyle(element);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);

  return [width, height];
};

export const setObjectPropertiesOnDom = (
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
  if (element.dataset.type === eObjectType.LINE_OF_SIGHT_WALL) {
    console.log("persist - line of sight wall");
  } else {
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
  }
};

export const setLineObjectPropertiesOnDom = (
  element: HTMLElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  element.x1.baseVal.value = x1;
  element.y1.baseVal.value = y1;
  element.x2.baseVal.value = x2;
  element.y2.baseVal.value = y2;
};

export const persistSelectedObjectDOMElementsToState = () => {
  const selectedObjectDOMElements =
    document.getElementsByClassName("__selected-object");

  const objs = [...Store.objects];

  for (let el of selectedObjectDOMElements) {
    const element = el as HTMLElement;
    const obj = Store.objects.find((o) => o.id === element.id)!;
    const objIndex = Store.objects.findIndex((o) => o.id === element.id);

    // todo this all needs to change for line of sight walls

    if (obj.type === eObjectType.LINE_OF_SIGHT_WALL) {
      const [x1, y1, x2, y2] = getDomLinePoints(element);
      // const [width, height] = getDOMElementDimensionsStyleValues(element);

      console.log("x1, y1, x2, y2", x1, y1, x2, y2);

      objs[objIndex] = {
        ...obj,
        x: x1,
        y: y1,
        wallEndPoint: {
          x: x2,
          y: y2,
        },
        width: Number(element.dataset.width),
        height: Number(element.dataset.height),
      };
    } else if (obj.type === eObjectType.TEXT) {
      const [x, y] = getElementPointData(element);
      const [width, height] = getElementDimensionData(element);
      const fontSize = parseFloat(getComputedStyle(element).fontSize);

      objs[objIndex] = {
        ...obj,
        x,
        y,
        width,
        height,
        fontSize: fontSize,
      };
    } else {
      const [x, y] = getElementPointData(element);
      const [width, height] = getElementDimensionData(element);
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
  console.log("chunks", chunks);
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

export const getDomLinePoints = (element: any) => {
  return [
    element.x1!.baseVal.value,
    element.y1!.baseVal.value,
    element.x2!.baseVal.value,
    element.y2!.baseVal.value,
  ];
};
