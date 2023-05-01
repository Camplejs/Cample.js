"use-strict";
import { createError, checkFunction } from "./../../../shared/utils";
import {
  ScriptType,
  FunctionsType,
  ScriptFunctionType,
  ScriptOptionsType,
  DataType,
  ScriptArgumentsType,
  ScriptElementsType
} from "../../../types/types";
import { renderScriptElements } from "./render-script-elements";
export const renderScript = (
  script: ScriptType,
  element: any,
  functions: FunctionsType,
  exportData: DataType,
  isEach = false,
  isReplaceTags = false,
  currentElements?: ScriptElementsType
): void => {
  let scripts: ScriptFunctionType;
  let options: ScriptOptionsType = {};
  const createScriptArguments = (
    currentElements: ScriptElementsType,
    currentFunctions: FunctionsType,
    currentData: DataType
  ): ScriptArgumentsType => {
    return {
      elements: currentElements,
      functions: currentFunctions,
      data: currentData,
      import: exportData
    };
  };
  if (Array.isArray(script)) {
    scripts = script[0];
    options = script[1];
    let elements: ScriptElementsType = {};
    if (typeof options.elements !== "undefined") {
      if (isReplaceTags) {
        elements = currentElements ? currentElements : {};
      } else {
        elements = renderScriptElements(options.elements, element, isEach);
      }
    }
    const scriptArguments = createScriptArguments(
      elements,
      functions,
      exportData
    );
    scripts(scriptArguments);
  } else {
    if (checkFunction(script)) {
      scripts = script;
      const scriptArguments = createScriptArguments({}, functions, exportData);
      scripts(scriptArguments);
    } else {
      createError("Script is an array or a function");
    }
  }
};
