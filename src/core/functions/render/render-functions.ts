"use strict";

import { createError } from "../../../shared/utils";
import { FunctionsOptionType, FunctionsType } from "../../../types/types";
import { renderFunction } from "./render-function";

export const renderFunctions = (
  functionsObject: FunctionsType,
  functions: FunctionsType,
  functionsList: FunctionsOptionType | undefined,
  isEach: boolean = false
) => {
  for (const functionName in functionsList) {
    if (isEach && functions[functionName] !== undefined) {
      createError("Function cannot be called the same as functionName");
    }
    functionsObject[functionName] = renderFunction(
      functions,
      functionsList[functionName]
    );
  }
};
