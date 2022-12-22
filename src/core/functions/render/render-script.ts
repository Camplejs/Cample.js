"use-strict";
import { ScriptType, FunctionsType } from "../../../types/types";
export const renderScript = (
  script: ScriptType,
  element: any,
  functions: FunctionsType
): void => {
  const scripts = script[0];
  const options = script[1];
  const elements: any = {};
  if (typeof options.elements !== "undefined") {
    options.elements.forEach((e) => {
      elements[Object.keys(e)[0]] = element.querySelector(e[Object.keys(e)[0]]);
    });
  }
  scripts(elements, functions);
};
