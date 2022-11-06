"use-strict";
import { renderStyle } from "../functions/render-style";
import {
  OptionsRenderRouteType,
  OptionsType,
  SelectorType,
  CampleOptionsType
} from "../types/types";
import { renderTemplate } from "./../functions/render-template";

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public defaultDocument: Document;
  public options?: CampleOptionsType;

  constructor(selector?: SelectorType, options?: CampleOptionsType) {
    this.selector = selector ? selector : "";
    this.template = "";
    this.options = options;
    this.defaultDocument = document;
    this.style = "";
  }

  render(template = "", options: OptionsType = {}): void {
    if (
      this.options &&
      this.options.mode &&
      this.options.mode.value === "watch"
    ) {
      this.template = renderTemplate(template, options);
      if (typeof this.selector === "string") {
        const el: Element | null = document.querySelector(this.selector);
        if (el) el.innerHTML = this.template;
        Object.keys(options).forEach((e) => {
          if (options[e]._getStyle) {
            this.style += options[e]._getStyle;
          }
        });
        renderStyle(this.style, true, this.options.mode.styleId);
        Object.keys(options).forEach((e) => {
          options[e].render(true);
        });
      }
    } else {
      this.template = renderTemplate(template, options);
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
          options[e].render();
        });
      }
    }
  }

  renderRoutes(options: OptionsRenderRouteType = {}): void {
    if (
      this.options &&
      this.options.mode &&
      this.options.mode.value === "watch"
    ) {
      const keys = Object.keys(options);
      for (let i = 0; i < keys.length; i++) {
        if (options[keys[i]].path === window.location.pathname) {
          options[keys[i]].render();
          this.selector = options[keys[i]].selector;
          this.render(options[keys[i]].template, options[keys[i]].components);
          break;
        }
      }
      window.addEventListener("pathnamechange", () => {
        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
          if (options[keys[i]].path === window.location.pathname) {
            options[keys[i]].render();
            this.selector = options[keys[i]].selector;
            this.render(options[keys[i]].template, options[keys[i]].components);
            break;
          }
        }
      });
    } else {
      const keys = Object.keys(options);
      for (let i = 0; i < keys.length; i++) {
        if (options[keys[i]].path === window.location.pathname) {
          options[keys[i]].render();
          this.selector = options[keys[i]].selector;
          this.render(options[keys[i]].template, options[keys[i]].components);
          break;
        }
      }
    }
  }
}
