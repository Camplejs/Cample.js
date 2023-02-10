"use-strict";
import {
  ComponentsType,
  SelectorType,
  DefaultOptionsType,
  StyleType,
  AttributesType
} from "../../../types/types";

export class Operator {
  public selector: SelectorType;
  public components: ComponentsType;
  public options: DefaultOptionsType | undefined;
  public attributes: AttributesType | undefined;
  public style: StyleType;
  public template: string;
  public replaceTag?: boolean;
  public replaceTags?: boolean;
  public trimHTML?:boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    options: DefaultOptionsType | undefined = undefined
  ) {
    this.selector = selector;
    this.components = components;
    this.options = options;
    this.attributes =
      typeof this.options !== "undefined" ? this.options.attributes : undefined;
    this.style = typeof this.options !== "undefined" ? this.options.style : "";
    this.template = "";
    this.replaceTag = options ? options.replaceTag : undefined;
    this.replaceTags = options ? options.replaceTags : undefined;
    this.trimHTML = options ? options.trimHTML : undefined;
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
}
