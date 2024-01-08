"use-strict";
import { createError, checkFunction } from "./../../../shared/utils";
import {
  ScriptType,
  FunctionsType,
  ScriptFunctionType,
  DataType,
  ScriptArgumentsType
} from "../../../types/types";

export const renderScript = (
  element: Element | null,
  data: DataType | undefined,
  script: ScriptType,
  functions?: FunctionsType,
  exportData?: DataType
): void => {
  let scripts: ScriptFunctionType;
  const createScriptArguments = (
    currentFunctions?: FunctionsType
  ): ScriptArgumentsType => {
    return {
      element,
      functions: currentFunctions,
      currentData: data,
      importedData: exportData
    };
  };
  if (Array.isArray(script)) {
    scripts = script[0];
    const scriptArguments = createScriptArguments(functions);
    scripts(scriptArguments);
  } else {
    if (checkFunction(script)) {
      scripts = script;
      const scriptArguments = createScriptArguments(functions);
      scripts(scriptArguments);
    } else {
      createError("Script is an array or a function");
    }
  }
};
