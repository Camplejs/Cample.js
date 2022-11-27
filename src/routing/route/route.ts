"use-strict";
import { OptionsType, SelectorType, TemplateType } from "../../types/types";
import { createError } from "../../utils/utils";

export class Route {
  public selector: SelectorType;
  public options: OptionsType;
  public path: string;
  public template: TemplateType;

  constructor(
    selector: SelectorType,
    template: TemplateType,
    options: OptionsType = {},
    path: string
  ) {
    this.selector = selector;
    this.options = options;
    this.template = template ? template : "";
    this.path = path;
  }

  render(): void {
    if (
      typeof this.selector === "undefined" ||
      typeof this.path === "undefined"
    )
      createError("Error: Properties 'selector', 'path' is required");
  }
}
