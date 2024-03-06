"use strict";

import { createError } from "../../../shared/utils";
import { FunctionsType } from "../../../types/types";

export const renderFunction = (functions: FunctionsType, val: any) => {
  let funcUser = undefined;
  if (val.length === 2) {
    const functionName = val[1];
    if (functions[functionName] !== undefined) {
      const func = functions[functionName];
      const exportFunc = val[0];
      funcUser = exportFunc.bind(this, func);
    } else createError(`Function ${functionName} not found`);
  } else createError("Data error");
  return funcUser;
};
