"use-strict";
import {
  DefaultDataOptionsType,
  ExportDataArrayType,
  ExportIdType,
  ImportObjectType,
  ScriptType,
  SelectorType
} from "../../../types/types";
import { Dynamic } from "../../data/dynamic/dynamic";
import { ParentComponent } from "../parent-component/parent-component";

export class DataComponent extends ParentComponent {
  public importId?: ExportIdType;
  public import?: ImportObjectType;
  public script: ScriptType | undefined;
  public _dynamic: Dynamic;
  public dataSet: ExportDataArrayType;

  constructor(
    selector: SelectorType,
    options: DefaultDataOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.script = options.script;
    this.dataSet = [];
    this._dynamic = new Dynamic();
    this.import = options.import;
    this.importId = undefined;
  }

  get _getImport(): ImportObjectType | undefined {
    return this.import;
  }
}
