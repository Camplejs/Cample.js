"use-strict";
import { createError } from "./../../../shared/utils";
import {
  ScriptType,
  FunctionsType,
  ScriptFunctionType,
  ScriptOptionsType,
  DataType
} from "../../../types/types";
export const renderScript = (
  script: ScriptType,
  element: any,
  functions: FunctionsType,
  exportData: DataType,
  isEach = false
): void => {
  let scripts: ScriptFunctionType;
  let options: ScriptOptionsType = {};
  if (Array.isArray(script)) {
    scripts = script[0];
    options = script[1];
    const elements: any = {};
    if (typeof options.elements !== "undefined") {
      options.elements.forEach((e) => {
        elements[Object.keys(e)[0]] = isEach
          ? document.querySelector(e[Object.keys(e)[0]])
          : element.querySelector(e[Object.keys(e)[0]]);
      });
    }
    scripts({ elements, functions, data: exportData });
  } else {
    if (Object.prototype.toString.call(script) === "[object Function]") {
      scripts = script;
      scripts({ elements: {}, functions, data: exportData });
    } else {
      createError("Script is an array or a function");
    }
  }
};
