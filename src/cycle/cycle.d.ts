import {
  ComponentsType,
  DefaultOptionsType,
  LengthType,
  SelectorType,
  StyleType,
  AttributesType,
} from "../types/types";

export class Cycle {
  constructor(
    selector: SelectorType,
    components: ComponentsType,
    length: LengthType,
    options?: DefaultOptionsType
  );
  selector: SelectorType;
  length: LengthType;
  components: ComponentsType;
  attributes: AttributesType | undefined;
  template: string;
  options: DefaultOptionsType | undefined;
  style: StyleType;
  get _getSelector(): SelectorType;
  get _getStyle(): StyleType;
  render(): void;
}
