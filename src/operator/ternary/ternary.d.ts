type AttributesType = {
    [key:string]:string;
}
type ElementType = {
    selector:string;
    id?:string;
    class?:string;
    attributes?:AttributesType;
}
type DefaultOptionsType = {
    attributes?: AttributesType;
    style?:string | undefined;
    element?:ElementType;
}
type SelectorType = string | undefined;
type ComponentsType = Array<string>;

export class Ternary extends Operator {
    constructor(selector: SelectorType, components:ComponentsType, bool: boolean, options?: DefaultOptionsType);
    bool: boolean;
    render(): void;
}

import { Operator } from "../operator";
