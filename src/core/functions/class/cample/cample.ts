"use-strict";

import { CampleOptionsType, SelectorType } from "../../../../types/types";
import { Cample } from "../../../cample";

const cample = (
  selector: SelectorType,
  options?: CampleOptionsType
): Cample => {
  return new Cample(selector, options);
};

export { cample };
