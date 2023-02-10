export type OptionsType = {
  [key: string]: any;
};

export type CampleOptionsType = {
  replaceTags?:boolean;
  trimHTML?:boolean;
}

export type TemplateType = string | undefined;
export type ComponentsType = Array<string>;

export type ComponentsTernaryType = [string, string];

export type SelectorType = string | undefined;

export type StyleType = string | undefined;

export type LengthType = number;

export type ComponentType = string | undefined;

export type RenderType = "default" | "dynamic";

export type UpdatingSetType = Map<any, any>;

export type FunctionsArray = Array<any>;

export type RenderComponentType = "cycle" | "component" | "animation" |"ternary"|"addition"|"if";

export type AttributesType = {
  [key: string]: string;
};


export type DynamicTextArrayType = Array<DynamicTextType>;

export type AttrValueType = {
  [key:string]:any;
}

export type AttrType = {
  values:AttrValueType,
  value:string;
  renderedValue:string;
}

export type AttributesValType ={
  [key:string]:AttrType;
}

export type DynamicTextType = {
  key:string;
  texts: Array<Text>;
  oldValue:any;
  value:any;
}
export type TextArrayType = Array<Text>;
export type DynamicFunctionsType = {
  [key:string]:(attribute?: any)=>void
}
export type DynamicType ={
  functions:DynamicFunctionsType;
  nodes:Array<NodeType>;
}

export type NodeType = {
  updateText:any;
  updateAttr:any;
  index:number;
  attrs:AttributesValType;
  texts:TextArrayType;
  dynamicAttrs:ArrayStringType;
  dynamicTexts: DynamicTextArrayType;
}
export type ArrayNodeType = Array<NodeType>;

export type ArrayStringType = Array<string>;
export type ElementType = {
  selector: string;
  id?: string;
  class?: string;
  attributes?: AttributesType;
};

export type DefaultOptionsType = {
  attributes?: AttributesType;
  style?: StyleType;
  element?: ElementType;
  replaceTag?:boolean;
  replaceTags?:boolean;
  trimHTML?:boolean;
};

export type DataPropertyType = {
  value?: any;
  defaultValue?: any;
};

export type DataType = {
  [key: string]: any | DataPropertyType;
};
export type ElementsElementType = {
  [key: string]: string;
};

export type StartType = "afterLoad" | "beforeLoad";
export type ScriptOptionsType = {
  start?: StartType;
  elements?: Array<ElementsElementType>;
};
export type ScriptType = [(...args: any[]) => void, ScriptOptionsType];

export type ComponentOptionsType = {
  script?: ScriptType;
  data?: DataType;
  style?: StyleType;
  attributes?: AttributesType;
  replaceTag?:boolean;
  trimHTML?:boolean;
};

export type AnimationElementType = {
  selector: string;
  id?: string;
  class?: string;
  transition?: string;
  attributes?: AttributesType;
};

export type AnimationOptionsType = {
  event: string;
  reverseEvent?: string;
  attributes?: AttributesType;
  styleAnimation: string;
  style?: string;
  class: string;
  transition?: string;
  element?: AnimationElementType;
  replaceTag?:boolean;
  replaceTags?:boolean;
  trimHTML?:boolean;
};

export type FunctionsType = {
  [key: string]: any;
};
