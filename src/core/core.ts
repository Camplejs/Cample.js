"use-strict";
import { renderStyle } from "../functions/render-style";
import { OptionsType, SelectorType } from "../types/types";
const renderTemplate = (template: string, options: any): string => {
  if (typeof options === "undefined") return template;
  const regex = /\{{(.*?)}}/g;
  template = template.replace(regex, (str, d) => {
    const key = d.trim();
    if (!options[key]) return str;
    return options[key]._getSelector
      ? document.createElement(options[key]._getSelector).outerHTML
      : str;
  });
  return template;
};

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public options: OptionsType;

  constructor(selector: SelectorType) {
    this.selector = selector;
    this.template = "";
    this.options = {};
    this.style = "";
  }
  render(template: string, options: OptionsType): void {
    if (
      typeof this.template === "undefined" ||
      typeof this.options === "undefined"
    )
      return;
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
