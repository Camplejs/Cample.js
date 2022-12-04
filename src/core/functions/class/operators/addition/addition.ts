"use-strict";

import { SelectorType, ComponentsType, DefaultOptionsType } from "../../../../../types/types";
import { Addition } from "../../../../components/operators/addition/addition";

const addition = (
  selector: SelectorType,
  components: ComponentsType,
  options: DefaultOptionsType | undefined
) : Addition =>{
    return new Addition(selector, components, options);
}

export {addition};