"use-strict";
import { renderTemplateElement } from "../../functions/render/render-template-element";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  LengthType,
  SelectorType,
  StyleType,
  AttributesType
} from "../../../types/types";
import { createError } from "../../../shared/utils";

export class Cycle {
  public selector: SelectorType;
  public length: LengthType;
  public components: ComponentsType;
  public template: string;
  public options: DefaultOptionsType;
  public attributes: AttributesType | undefined;
  public style: StyleType;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    length: LengthType = 0,
    options: DefaultOptionsType = {}
  ) {
    this.selector = selector;
    this.length = length;
    this.components = components;
    this.template = "";
    this.options = options;
    this.attributes = this.options.attributes;
    this.style = this.options.style ? this.options.style : "";
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  render(): void {
    if (typeof this.components === "undefined" || this.components.length === 0)
      createError("Error: Cycle component renders one and more components");
    let templateElement: any = null;
    if (typeof this.options !== "undefined") {
      if (this.options.element) {
        templateElement = renderTemplateElement(
          this.options.element.selector,
          this.options.element.id,
          this.options.element.class,
          this.options.element.attributes
        );
      }
    }
    for (let i = 0; i < this.length; i++) {
      this.components.forEach((component) => {
        this.template += document.createElement(component).outerHTML;
      });
    }
    if (templateElement)
      templateElement.insertAdjacentHTML("afterbegin", this.template);
    if (this.selector)
      document.querySelectorAll(this.selector).forEach((e) => {
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        e.innerHTML = templateElement
          ? templateElement.outerHTML
          : this.template;
      });
  }
}
