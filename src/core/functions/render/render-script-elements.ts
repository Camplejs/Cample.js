"use-strict";

import { ElementsElementType, ScriptElementsType } from "../../../types/types";

export const renderScriptElements = (
  elements: ElementsElementType[] | undefined,
  element: Element | DocumentFragment
): ScriptElementsType => {
  const elementsObject: ScriptElementsType = {};
  elements?.forEach((e) => {
    elementsObject[Object.keys(e)[0]] = element.querySelector(
      e[Object.keys(e)[0]]
    );
  });
  return elementsObject;
};
