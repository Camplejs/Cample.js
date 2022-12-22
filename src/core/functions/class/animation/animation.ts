"use-strict";

import {
  SelectorType,
  ComponentType,
  AnimationOptionsType
} from "../../../../types/types";
import { AnimationComponent } from "../../../components/animation/animation";

const animationComponent = (
  selector: SelectorType,
  component: ComponentType,
  options: AnimationOptionsType
): AnimationComponent => {
  return new AnimationComponent(selector, component, options);
};

export { animationComponent };
