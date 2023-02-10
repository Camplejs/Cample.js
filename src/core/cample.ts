"use-strict";
import { renderStyle } from "./functions/render/render-style";
import { CampleOptionsType, OptionsType, SelectorType } from "../types/types";
import { renderTemplate } from "./functions/render/render-template";

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public replaceTags:boolean;
  public trimHTML?:boolean;

  constructor(selector: SelectorType, options:CampleOptionsType= {
    replaceTags:true,
    trimHTML:false
  }) {
    this.selector = selector ? selector : "";
    this.template = "";
    this.replaceTags = options.replaceTags !== undefined? options.replaceTags : true;
    this.trimHTML = options.trimHTML !== undefined?options.trimHTML:false;
    this.style = "";
  }
  render(template = "", options: OptionsType = {}): void {
    this.template = renderTemplate(template, options,this.replaceTags);
    if (typeof this.selector === "string") {
      const el: Element | null = document.querySelector(this.selector);
      if (el) el.innerHTML = this.template;
      Object.keys(options).forEach((e) => {
        if (options[e]._getStyle) {
          this.style += options[e]._getStyle;
        }
      });
      renderStyle(this.style);
      Object.keys(options).forEach((e) => {
        options[e].render(this.replaceTags, this.trimHTML);
      });
    }
  }
}
