"use-strict";

import {
  SelectorType,
  EachDataType,
  EachTemplateFunction,
  EachOptionsType
} from "../../../../../types/types";
import { Each } from "../../../../components/cycles/each/each";

const each = (
  selector: SelectorType,
  data: EachDataType,
  templateFunction: EachTemplateFunction,
  options: EachOptionsType | undefined
): Each => {
  return new Each(selector, data, templateFunction, options);
};

export { each };
