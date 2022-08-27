import {ComponentsType, SelectorType, DefaultOptionsType,StyleType} from "../types/types";
export class Operator {
    constructor(selector:SelectorType, components: ComponentsType, options?: DefaultOptionsType);
    selector: SelectorType;
    components: ComponentsType;
    options: DefaultOptionsType;
    style: StyleType;
    template: string;
    get getSelector(): SelectorType;
    get getStyle(): StyleType;
}
