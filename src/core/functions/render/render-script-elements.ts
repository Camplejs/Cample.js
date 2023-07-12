"use-strict";

import { ElementsOptionsType, ScriptElementsType } from "../../../types/types";

export const renderScriptElements = (
  elements: ElementsOptionsType | undefined,
  element: Element | DocumentFragment
): ScriptElementsType => {
  const elementsObject: ScriptElementsType = {};
  if (elements)
    Object.entries(elements).forEach(([key, value]) => {
      elementsObject[key] = element.querySelector(value);
    });
  return elementsObject;
};
