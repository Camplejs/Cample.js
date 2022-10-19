"use-strict";
import { OptionsType, SelectorType, TemplateType } from "../types/types";
import { createError } from "../utils/utils";

export class Route {
  public selector: SelectorType;
  public components: OptionsType;
  public path: string;
  public template: TemplateType;

  constructor(
    selector: SelectorType,
    template: TemplateType,
    components: OptionsType = {},
    path: string
  ) {
    this.selector = selector;
    this.components = components;
    this.template = template ? template : "";
    this.path = path;
  }

  render(): void {
    if (
      typeof this.selector === "undefined" ||
      typeof this.path === "undefined"
    )
      createError("Error: Property 'selector', 'path' is required");
  }
}
