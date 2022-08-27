export type OptionsType = {
    [key:string]: object;
}

export type ComponentsType = Array<string>;

export type ComponentsTernaryType = [string, string];

export type SelectorType = string | undefined;

export type StyleType = string | undefined;

export type LengthType = number | undefined;

export type ComponentType = string | undefined;

export type ElementType = {
    selector:string;
    id?:string;
    class?:string;
}

export type DefaultOptionsType = {
    style?:StyleType,
    element?:ElementType;
}
export type DataType = {
    [key:string]:any;
}
export type ElementsElementType ={
    [key:string]:string;
}
export type ScriptOptionsType = {
    start?:"afterLoad" | "beforeLoad";
    elements?:Array<ElementsElementType>
}
export type ScriptType = [Function,ScriptOptionsType];

export type ComponentOptionsType={
    script?:ScriptType;
    data?:DataType;
    style?:StyleType;
}

export type AnimationElementType = {
    selector:string;
    id?:string;
    class?:string;
    transition?:string;
}

export type AnimationOptionsType = {
    event:string;
    reverseEvent?:string;
    style:string;
    class:string;
    transition?:string;
    element?:AnimationElementType;
}