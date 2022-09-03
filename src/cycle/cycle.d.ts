import { ComponentsType, DefaultOptionsType, LengthType, SelectorType, StyleType, AttributesType } from "../types/types";

export class Cycle {
    constructor(selector: SelectorType, components: ComponentsType, length: LengthType, options?: DefaultOptionsType);
    selector: SelectorType;
    length: LengthType;
    components: ComponentsType;
    attributes: AttributesType | undefined;
    template: string;
    options: DefaultOptionsType | undefined;
    style: StyleType;
    get getSelector(): SelectorType;
    get getStyle(): StyleType;
    render(): void;
}