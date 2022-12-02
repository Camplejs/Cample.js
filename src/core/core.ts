"use-strict";
import { renderStyle } from "../functions/render-style";
import { OptionsType, SelectorType } from "../types/types";
import { renderTemplate } from "./../functions/render-template";

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public options: OptionsType;

  constructor(selector: SelectorType) {
    this.selector = selector ? selector : "";
    this.template = "";
    this.options = {};
    this.style = "";
  }
  render(template = "", options: OptionsType = {}): void {
    this.template = renderTemplate(template, options);
    if (typeof this.selector === "string") {
      const el: Element | null = document.querySelector(this.selector);
      if (el) el.insertAdjacentHTML("afterbegin", this.template);
      Object.keys(options).forEach((e) => {
        if (options[e]._getStyle) {
          this.style += options[e]._getStyle;
        }
      });
      renderStyle(this.style);
      Object.keys(options).forEach((e) => {
        options[e].render();
      });
    }
  }
}
