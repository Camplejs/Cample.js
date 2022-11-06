"use-strict";
import { renderTemplateElement } from "../../functions/render-template-element";
import { renderAttributes } from "../../functions/render-attributes";
import { renderRouteLink } from "../../functions/render-routelink";
import {
  ComponentType,
  DefaultOptionsType,
  SelectorType,
  StyleType,
  AttributesType
} from "../../types/types";
import { createError } from "../../utils/utils";

export class RouteLink {
  public selector: SelectorType;
  public component: ComponentType;
  public template: string;
  public path: string;
  public options: DefaultOptionsType;
  public attributes: AttributesType | undefined;
  public style: StyleType;

  constructor(
    selector: SelectorType,
    component: ComponentType,
    path: string,
    options: DefaultOptionsType = {}
  ) {
    this.selector = selector;
    this.component = component;
    this.template = "";
    this.path = path;
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
  render(watch = false): void {
    if (
      typeof this.selector === "undefined" ||
      typeof this.path === "undefined" ||
      typeof this.component === "undefined"
    ) {
      createError(
        "Error: Properties 'selector', 'path', 'component' is required"
      );
    } else {
      const component = document.createElement(this.component);
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

      if (templateElement) {
        templateElement.appendChild(component);
      }

      this.template = templateElement
        ? templateElement.outerHTML
        : component.outerHTML;
      if (this.selector) {
        document.querySelectorAll(this.selector).forEach((e) => {
          if (typeof this.attributes !== "undefined") {
            renderAttributes(e, this.attributes);
          }
          if (watch) {
            e.replaceChildren();
            e.insertAdjacentHTML("afterbegin", this.template);
            this.template = "";
            templateElement = null;
          } else {
            e.insertAdjacentHTML("afterbegin", this.template);
          }
          renderRouteLink(e, this.path);
        });
      }
    }
  }
}
