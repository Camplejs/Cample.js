import {ComponentOptionsType, SelectorType, StyleType,DataType,ScriptType} from "../types/types";

export class Component {
    constructor(selector: SelectorType, template: string, options?: ComponentOptionsType);
    selector: SelectorType;
    template: string;
    script: ScriptType | undefined;
    data: DataType | undefined;
    style: StyleType | undefined;
    get getSelector(): SelectorType;
    get getStyle(): StyleType;
    render(): void;
}
