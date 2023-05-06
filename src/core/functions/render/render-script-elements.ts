"use-strict";

import { ElementsElementType, ScriptElementsType } from "../../../types/types";

export const renderScriptElements = (
  elements: ElementsElementType[],
  element: Element | DocumentFragment,
  isEach: boolean
): ScriptElementsType => {
  const elementsObject: ScriptElementsType = {};
  elements.forEach((e) => {
    if (isEach) {
      elementsObject[Object.keys(e)[0]] = document.querySelector(
        e[Object.keys(e)[0]]
      );
    } else {
      elementsObject[Object.keys(e)[0]] = element.querySelector(
        e[Object.keys(e)[0]]
      );
    }
  });
  return elementsObject;
};
