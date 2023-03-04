"use-strict";
import {
  AttributesType,
  DefaultOptionsType,
  ExportDataType,
  ExportIdType,
  SelectorType,
  StyleType
} from "../../../types/types";

export class ParentComponent {
  public template: string;
  public selector: SelectorType;
  public style: StyleType | undefined;
  public export?: ExportDataType;
  public attributes: AttributesType | undefined;
  public exportId?: ExportIdType;
  public replaceTag?: boolean;
  public trimHTML?: boolean;
  public options: DefaultOptionsType;

  constructor(
    selector: SelectorType,
    options: DefaultOptionsType | undefined = {}
  ) {
    this.selector = selector;
    this.template = "";
    this.options = options;
    this.replaceTag = options.replaceTag;
    this.trimHTML = options.trimHTML;
    this.attributes = options.attributes;
    this.style = options.style;
    this.export = options.export;
    this.exportId = options.exportId;
  }

  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  get _getExport(): ExportDataType | undefined {
    return this.export;
  }
  get _getExportId(): ExportIdType | undefined {
    return this.exportId;
  }
}