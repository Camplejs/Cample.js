"use-strict";
import { renderStyle } from "./functions/render/render-style";
import {
  CampleOptionsType,
  ExportCampleDataType,
  OptionsType,
  SelectorType
} from "../types/types";
import { renderTemplate } from "./functions/render/render-template";
import { checkFunction, getExportData } from "../shared/utils";
import { CLICK_FUNCTION_NAME } from "../config/config";

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public trimHTML?: boolean;
  public exportData: ExportCampleDataType;
  public _isListener: boolean;
  public _el: Element | null;

  constructor(
    selector: SelectorType,
    options: CampleOptionsType = {
      trimHTML: false
    }
  ) {
    this.selector = selector ? selector : "";
    this.template = "";
    this.trimHTML = options.trimHTML !== undefined ? options.trimHTML : false;
    this.exportData = {};
    this.style = "";
    this._isListener = false;
    this._el = null;
  }
  render(template = "", options: OptionsType = {}): void {
    this.template = renderTemplate(template, options);

    if (typeof this.selector === "string") {
      const eventListener: EventListenerOrEventListenerObject = (
        current: Event
      ) => {
        let node: any =
          current.composedPath !== undefined
            ? current.composedPath()[0]
            : current.target;
        while (node !== null) {
          const eventListener = node[CLICK_FUNCTION_NAME];
          if (eventListener !== undefined && !node.disabled) {
            eventListener(current);
            if (current.cancelBubble) return;
          }
          node = node.parentNode;
        }
      };
      const el: Element | null = document.querySelector(this.selector);
      if (el !== null) {
        el.innerHTML = this.template;
        this._el = el;
      }
      const setEventListener = () => {
        if (!this._isListener && this._el !== null) {
          document.addEventListener("click", eventListener);
          this._isListener = true;
        }
      };
      Object.keys(options).forEach((e) => {
        if (options[e]._getStyle) {
          this.style += options[e]._getStyle;
        }
      });
      const setComponents = (selector: string, component: any) => {
        if (selector && this.exportData.hasOwnProperty(selector)) {
          this.exportData[selector].components.push(component);
        }
      };
      const setExport = (
        selector: any,
        data: any,
        exportId: number,
        index = 0
      ) => {
        this.exportData[selector].value[exportId][index] = data;
        for (let i = 0; i < this.exportData[selector].components.length; i++) {
          const e = this.exportData[selector].components[i];
          e.render(
            setEventListener,
            this.trimHTML,
            this.exportData[selector].value,
            undefined,
            "dynamic"
          );
        }
      };
      renderStyle(this.style);
      Object.keys(options).forEach((e, i) => {
        const selector = options[e]._getSelector;
        options[e].render(
          setEventListener,
          this.trimHTML,
          selector && this.exportData.hasOwnProperty(selector)
            ? this.exportData[selector].value
            : undefined,
          options[e]._getExportId !== undefined
            ? options[e]._getExportId
            : options[e]._getExport
              ? i
              : undefined
        );
        if (selector && this.exportData.hasOwnProperty(selector)) {
          setComponents(selector, options[e]);
        }
        if (options[e]._getExport !== undefined) {
          const exportData = checkFunction(options[e]._getExport)
            ? options[e]._getExport(setExport)
            : options[e]._getExport;
          if (exportData) {
            this.exportData = getExportData(
              this.exportData,
              exportData,
              options[e]._getExportId !== undefined
                ? options[e]._getExportId
                : i
            );
          }
        }
      });
    }
  }
}
