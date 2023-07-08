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

export const renderScript = (
  data: DataType | undefined,
  script: ScriptType,
  functions: FunctionsType,
  exportData: DataType | undefined,
  currentElements?: ScriptElementsType
): void => {
  let scripts: ScriptFunctionType;
  let options: ScriptOptionsType = {};
  const createScriptArguments = (
    currentElements: ScriptElementsType,
    currentFunctions: FunctionsType,
    currentData: DataType | undefined
  ): ScriptArgumentsType => {
    return {
      elements: currentElements,
      functions: currentFunctions,
      currentData: data,
      importedData: exportData
    };
  };
  if (Array.isArray(script)) {
    scripts = script[0];
    options = script[1];
    let elements: ScriptElementsType = {};
    if (typeof options.elements !== "undefined") {
      elements = currentElements ? currentElements : {};
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
