import {ComponentsType, SelectorType, DefaultOptionsType, StyleType, AttributesType} from "../types/types";
export class Operator {
    constructor(selector:SelectorType, components: ComponentsType, options?: DefaultOptionsType);
    selector: SelectorType;
    components: ComponentsType;
    options: DefaultOptionsType;
    attributes: AttributesType | undefined;
    style: StyleType;
    template: string;
    get getSelector(): SelectorType;
    get getStyle(): StyleType;
}
