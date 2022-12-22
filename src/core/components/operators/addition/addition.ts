"use-strict";
import { Operator } from "../operator";
import { renderTemplateElement } from "../../../functions/render/render-template-element";
import { renderAttributes } from "../../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  SelectorType
} from "../../../../types/types";
import { createError } from "../../../../shared/utils";
export class Addition extends Operator {
  constructor(
    selector: SelectorType,
    components: ComponentsType,
    options: DefaultOptionsType | undefined = undefined
  ) {
    super(selector, components, options);
  }
  render(): void {
    if (typeof this.components === "undefined" || this.components.length < 1)
      createError("Error: Addition operator renders two and more components");
    let templateElement: any = null;
    this.components.forEach((component) => {
      this.template += document.createElement(component).outerHTML;
    });
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
        e.innerHTML = templateElement
          ? templateElement.outerHTML
          : this.template;
      });
  }
}
