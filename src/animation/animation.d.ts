import {
  AnimationOptionsType,
  ComponentType,
  SelectorType,
  AttributesType,
} from "../types/types";

export class AnimationComponent {
  constructor(
    selector: SelectorType,
    component: ComponentType,
    options: AnimationOptionsType
  );
  selector: SelectorType;
  component: ComponentType;
  template: string;
  options: AnimationOptionsType;
  attributes: AttributesType | undefined;
  styleAnimation: string;
  style: string;
  get _getSelector(): SelectorType;
  get _getStyle(): string;
  render(): void;
}
