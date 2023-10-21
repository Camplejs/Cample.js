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
  private _isListener: boolean;

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
  }
  render(template = "", options: OptionsType = {}): void {
    this.template = renderTemplate(template, options);

    const renderNode = (node: any, current: { cancelBubble: any }) => {
      while (node) {
        const eventListener = node[CLICK_FUNCTION_NAME];
        if (eventListener && !node.disabled) {
          eventListener.call(node);
          if (current.cancelBubble) return;
        }
        node = node.parentNode || node.host;
      }
    };
    const eventListener = (current: any) => {
      let currentNode = current?.composedPath()[0] || current.target;
      if (current.target !== currentNode) {
        Object.defineProperty(current, "target", {
          configurable: true,
          value: currentNode
        });
      }
      Object.defineProperty(current, "currentTarget", {
        configurable: true,
        get() {
          return currentNode || document;
        }
      });
      renderNode(currentNode, current);
    };

    const setEventListener = () => {
      if (!this._isListener) {
        document.addEventListener("click", eventListener);
        this._isListener = true;
      }
    };
    if (typeof this.selector === "string") {
      const el: Element | null = document.querySelector(this.selector);
      if (el) el.innerHTML = this.template;
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
        if (selector && this.exportData.hasOwnProperty(selector)) {
          this.exportData[selector].value[exportId][index] = data;
          this.exportData[selector].components.forEach((e) => {
            e.render(
              setEventListener,
              this.trimHTML,
              selector && this.exportData.hasOwnProperty(selector)
                ? this.exportData[selector].value
                : undefined,
              e._getExportId !== undefined
                ? options[e]._getExportId
                : undefined,
              "dynamic"
            );
          });
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
        if (options[e]._getExport) {
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
