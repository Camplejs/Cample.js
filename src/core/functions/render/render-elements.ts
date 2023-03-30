import { checkObject } from "../../../shared/utils";
import { ScriptType } from "../../../types/types";

export const renderElements = (script: ScriptType | undefined) => {
  if (
    script &&
    Array.isArray(script) &&
    script[1] &&
    checkObject(script[1]) &&
    script[1].elements
  ) {
    return script[1].elements;
  } else return undefined;
};
