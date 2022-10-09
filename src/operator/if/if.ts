"use-strict";
import { Operator } from "../operator";
import { renderTemplateElement } from "../../functions/render-template-element";
import { renderAttributes } from "../../functions/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  SelectorType
} from "../../types/types";

export class If extends Operator {
  public bool: boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    bool: boolean,
    options: DefaultOptionsType | undefined
  ) {
    super(selector, components, options);
    this.bool = bool;
  }
  render(): void {
    if (typeof this.components === "undefined" || this.components.length === 0)
      return;

    let templateElement: any = null;

    if (this.bool) {
      if (this.components.length > 0) {
        this.components.forEach((component) => {
          this.template += document.createElement(component).outerHTML;
        });
      }
    }

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
    if (templateElement)
      templateElement.insertAdjacentHTML("afterbegin", this.template);
    if (this.selector)
      document.querySelectorAll(this.selector).forEach((e) => {
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        e.insertAdjacentHTML(
          "afterbegin",
          templateElement ? templateElement.outerHTML : this.template
        );
      });
  }
}