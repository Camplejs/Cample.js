"use-strict";

import {
  SelectorType,
  EachOptionsType,
  EachDataFunctionType
} from "../../../../types/types";
import { Each } from "../../../components/each/each";

const each = (
  selector: SelectorType,
  data: EachDataFunctionType,
  template: string,
  options: EachOptionsType | undefined
): Each => {
  return new Each(selector, data, template, options);
};

export { each };
