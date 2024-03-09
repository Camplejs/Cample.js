"use-strict";

import {
  DataExportObjectType,
  DefaultDataOptionsType,
  ExportDataType,
  ExportDynamicType,
  ExportIdType,
  ExportObjectDataArrayType,
  FunctionsObjType,
  ImportObjectType,
  FunctionsOptionType,
  ScriptType,
  SelectorType,
  ValuesType
} from "../../../types/types";
import { Dynamic } from "../../data/dynamic/dynamic";
import { ParentComponent } from "../parent-component/parent-component";

export class DataComponent extends ParentComponent {
  public importId?: ExportIdType;
  public import?: ImportObjectType;
  public script: ScriptType | undefined;
  public _dynamic: Dynamic;
  public exportDataObjects: ExportObjectDataArrayType;
  public export?: ExportDataType | ExportDynamicType;
  public exportObj?: DataExportObjectType;
  public values?: ValuesType;
  public dataFunctions?: FunctionsObjType;
  public functions?: FunctionsOptionType;
  public setExportData?: (...args: any[]) => any;
  public _isDataFunctions: boolean;

  constructor(
    selector: SelectorType,
    options: DefaultDataOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.script = options.script;
    this._dynamic = new Dynamic();
    this.import = options.import;
    this.importId = undefined;
    this.export = options.export;
    this.setExportData = undefined;
    this.exportDataObjects = [];
    this.exportObj = undefined;
    this.dataFunctions = options.dataFunctions;
    this.functions = options.functions;
    this.values = options.values !== undefined ? options.values : undefined;
    this._isDataFunctions = this.dataFunctions !== undefined;
  }

  get _getImport(): ImportObjectType | undefined {
    return this.import;
  }
}
