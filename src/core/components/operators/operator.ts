"use-strict";
import {
  ComponentsType,
  SelectorType,
  DefaultOptionsType
} from "../../../types/types";
import { ParentComponent } from "../parent-component/parent-component";

export class Operator extends ParentComponent {
  public components: ComponentsType;
  public replaceTags?: boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    options: DefaultOptionsType | undefined = undefined
  ) {
    super(selector, options);
    this.components = components;
    this.attributes =
      typeof this.options !== "undefined" ? this.options.attributes : undefined;
    this.style = typeof this.options !== "undefined" ? this.options.style : "";
    this.replaceTags = options ? options.replaceTags : undefined;
  }
}
