"use-strict";
import {
  DefaultDataOptionsType,
  ExportDataType,
  SelectorType
} from "../../../types/types";
import { renderStaticExport } from "../../functions/data/render-static-export";
import { ParentComponent } from "../parent-component/parent-component";

export class StaticDataComponent extends ParentComponent {
  public export?: ExportDataType;

  constructor(
    selector: SelectorType,
    options: DefaultDataOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.export = options.export;
  }

  get _getExport(): ExportDataType | undefined {
    return renderStaticExport(this.export);
  }
}
