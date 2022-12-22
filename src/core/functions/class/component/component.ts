"use-strict";

import { ComponentOptionsType, SelectorType } from "../../../../types/types";
import { Component } from "../../../components/component/component";
const component = (
  selector: SelectorType,
  template: string,
  options: ComponentOptionsType | undefined
): Component => {
  return new Component(selector, template, options);
};
export { component };
