"use-strict";

import { SelectorType, ComponentsType, DefaultOptionsType } from "../../../../../types/types";
import { If } from "../../../../components/operators/if/if";

const ifComponent = (
  selector: SelectorType,
  components: ComponentsType,
  bool: boolean,
  options: DefaultOptionsType | undefined
) : If =>{
    return new If(selector, components, bool, options);
}

export {ifComponent};