type ElementType = {
    selector:string;
    id?:string;
    class?:string;
}
type DefaultOptionsType = {
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
