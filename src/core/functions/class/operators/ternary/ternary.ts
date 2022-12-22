"use-strict";

import {
  SelectorType,
  ComponentsType,
  DefaultOptionsType
} from "../../../../../types/types";
import { Ternary } from "../../../../components/operators/ternary/ternary";

const ternary = (
  selector: SelectorType,
  components: ComponentsType,
  bool: boolean,
  options: DefaultOptionsType | undefined
): Ternary => {
  return new Ternary(selector, components, bool, options);
};

export { ternary };
