import {
  ComponentOptionsType,
  SelectorType,
  StyleType,
  DataType,
  ScriptType,
  AttributesType,
} from "../types/types";

export class Component {
  constructor(
    selector: SelectorType,
    template: string,
    options?: ComponentOptionsType
  );
  selector: SelectorType;
  template: string;
  attributes: AttributesType | undefined;
  script: ScriptType | undefined;
  data: DataType | undefined;
  style: StyleType | undefined;
  get _getSelector(): SelectorType;
  get _getStyle(): StyleType;
  render(): void;
}
