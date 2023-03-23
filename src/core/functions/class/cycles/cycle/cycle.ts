"use-strict";

import {
  SelectorType,
  ComponentsType,
  LengthType,
  DefaultOptionsType
} from "../../../../../types/types";
import { Cycle } from "../../../../components/cycles/cycle/cycle";

const cycle = (
  selector: SelectorType,
  components: ComponentsType,
  length: LengthType,
  options: DefaultOptionsType
): Cycle => {
  return new Cycle(selector, components, length, options);
};

export { cycle };
