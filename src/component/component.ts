"use-strict";
import { renderScript } from "../functions/render-script";
import { renderData } from "../functions/render-data";
import { renderAttributes } from "../functions/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  StyleType,
  DataType,
  ScriptType,
  AttributesType
} from "../types/types";
import { createError } from "../utils/utils";
export class Component {
  public selector: SelectorType;
  public template: string;
  public attributes: AttributesType | undefined;
  public script: ScriptType | undefined;
  public data: DataType | undefined;
  public style: StyleType | undefined;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    this.selector = selector;
    this.template = template;
    this.attributes = options.attributes;
    this.script = options.script;
    this.data = options.data;
    this.style = options.style;
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  render(): void {
    if (typeof this.selector !== "undefined") {
      document.querySelectorAll(this.selector).forEach((e, index) => {
        if (typeof this.script !== "undefined") {
          if (this.script[1].start === "beforeLoad")
            renderScript(this.script, e);
        }
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        e.insertAdjacentHTML(
          "afterbegin",
          renderData(this.template, this.data, index)
        );
        if (typeof this.script !== "undefined") {
          if (
            this.script[1].start === "afterLoad" ||
            this.script[1].start === undefined
          )
            renderScript(this.script, e);
        }
      });
    } else {
      createError("Error: Property 'selector' is required");
    }
  }
}
