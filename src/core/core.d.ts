import { OptionsType, SelectorType } from "../types/types";

export class Cample{
    constructor(selector:SelectorType);
    selector: SelectorType;
    template: string;
    style: string;
    render(template: string, options: OptionsType): void;
}
