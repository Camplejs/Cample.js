"use-strict";
import { renderStyle } from "./functions/render/render-style";
import {
  CampleOptionsType,
  ExportDataType,
  OptionsType,
  SelectorType
} from "../types/types";
import { renderTemplate } from "./functions/render/render-template";
import { getExportData } from "../shared/utils";

export class Cample {
  public selector: SelectorType;
  public template: string;
  public style: string;
  public replaceTags: boolean;
  public trimHTML?: boolean;
  public exportData: ExportDataType;

  constructor(
    selector: SelectorType,
    options: CampleOptionsType = {
      replaceTags: true,
      trimHTML: false
    }
  ) {
    this.selector = selector ? selector : "";
    this.template = "";
    this.replaceTags =
      options.replaceTags !== undefined ? options.replaceTags : true;
    this.trimHTML = options.trimHTML !== undefined ? options.trimHTML : false;
    this.exportData = {};
    this.style = "";
  }
  render(template = "", options: OptionsType = {}): void {
    this.template = renderTemplate(template, options, this.replaceTags);
    if (typeof this.selector === "string") {
      const el: Element | null = document.querySelector(this.selector);
      if (el) el.innerHTML = this.template;
      Object.keys(options).forEach((e, i) => {
        if (options[e]._getStyle) {
          this.style += options[e]._getStyle;
        }
        if (options[e]._getExport) {
          this.exportData = getExportData(
            this.exportData,
            options[e]._getExport,
            options[e]._getExportId !== undefined ? options[e]._getExportId : i
          );
        }
      });
      renderStyle(this.style);
      Object.keys(options).forEach((e, i) => {
        const selector = options[e]._getSelector;
        options[e].render(
          this.replaceTags,
          this.trimHTML,
          selector && this.exportData.hasOwnProperty(selector)
            ? this.exportData[selector]
            : undefined,
          options[e]._getExportId !== undefined
            ? options[e]._getExportId
            : options[e]._getExport
            ? i
            : undefined
        );
      });
    }
  }
}
