export type OptionsType = {
  [key: string]: any;
};

export type CampleOptionsType = {
  replaceTags?: boolean;
  trimHTML?: boolean;
};

export type ImportType = Array<string>;

export type BindType = Array<string>;

export type TemplateType = string | undefined;

export type ImportObjectType = {
  value: ImportType;
  exportId?: ExportIdType;
};

export type ComponentType =
  | string
  | {
      selector: string;
      import?: ImportType | ImportObjectType;
      bind?: BindType;
    }
  | undefined;

export type ComponentsType = Array<ComponentType>;

export type ImportObjectStringType = {
  import: string;
  exportId: ExportIdType | undefined;
};

export type ComponentsTernaryType = [ComponentType, ComponentType];

export type ConditionType = boolean | undefined;

export type SelectorType = string | undefined;

export type StyleType = string | undefined;

export type LengthType = number;

export type RenderType = "default" | "dynamic";

export type UpdatingSetType = Map<any, any>;

export type FunctionsArray = Array<any>;

export type RenderComponentType =
  | "cycle"
  | "component"
  | "animation"
  | "ternary"
  | "addition"
  | "if"
  | "each";

export type AttributesType = {
  [key: string]: string;
};

export type DataAttributeType = {
  selector: string;
  value: string | undefined;
};

export type EachDataObjectType = {
  [key: string]: any;
};
export type EachTemplateArgument = {
  [key: string]: any;
};
export type EachTemplateFunction = (
  argument?: EachTemplateArgument,
  index?: number
) => string;

export type EachDataValueType = EachDataObjectType | Array<any>;

export type EachDataFunctionType = (
  argument?: DataFunctionArgumentsType
) => EachDataValueType;

export type EachDataType = EachDataFunctionType | EachDataValueType;

export type DataAttributesArrayType = Array<DataAttributeType>;

export type DynamicTextArrayType = Array<DynamicTextType>;

export type AttrValueType = {
  [key: string]: any;
};

export type AttrType = {
  values: AttrValueType;
  value: string;
  renderedValue: string;
};

export type AttributesValType = {
  [key: string]: AttrType;
};

export type DynamicTextType = {
  key: string;
  texts: Array<Text>;
  oldValue: any;
  value: any;
};

export type TextArrayType = Array<Text>;

export type DynamicFunctionsType = {
  [key: string]: (attribute?: any) => void;
};

export type DataComponentType = DataType | DataFunctionType | undefined;

export type DynamicDataValueType = DataComponentType | EachDataValueType;

export type DynamicDataType = {
  value: DynamicDataValueType;
  oldValue?: DynamicDataValueType;
  id: number;
};

export type ElementsType = Element[];
export type DynamicNodeComponentNodeType = ChildNode | null | undefined;
export type DynamicNodeComponentParentNodeType = ParentNode | null | undefined;
export type DynamicNodeComponentType = {
  elements: ElementsType;
  parentNode: ParentNode;
  nodeNext: DynamicNodeComponentNodeType;
  nodePrevious: DynamicNodeComponentNodeType;
  nodeParentNode: DynamicNodeComponentParentNodeType;
  id: number;
};

export type LastNodeType = Element | ChildNode | ParentNode;

export type ScriptElementsType = {
  [key: string]: Element | null;
};
export type ScriptArgumentsType = {
  elements: ScriptElementsType;
  functions: FunctionsType;
  data: DataType;
};

export type DynamicType = {
  functions: DynamicFunctionsType;
  nodes: Array<NodeType>;
  data: {
    values: Array<DynamicDataType>;
    components: Array<DynamicNodeComponentType>;
    currentId: number;
  };
};

export type NodeType = {
  updateText: any;
  updateAttr: any;
  index: number;
  attrs: AttributesValType;
  texts: TextArrayType;
  dynamicAttrs: ArrayStringType;
  dynamicTexts: DynamicTextArrayType;
  dataId: number;
  eachIndex?: number;
};

export type ArrayNodeType = Array<NodeType>;

export type DynamicKeyObjectType = {
  key: string;
  properties: Array<string>;
};
export type DynamicKeyObjectArrayType = Array<DynamicKeyObjectType>;
export type DynamicKeyType = string | DynamicKeyObjectType;

export type DynamicKeyArrayType = Array<DynamicKeyType>;

export type ArrayStringType = Array<string>;

export type ElementType = {
  selector: string;
  id?: string;
  class?: string;
  attributes?: AttributesType;
};

export type RootOptionsType = {
  attributes?: AttributesType;
  style?: StyleType;
  replaceTag?: boolean;
  replaceTags?: boolean;
  trimHTML?: boolean;
  export?: ExportDataType;
  exportId?: ExportIdType;
};
export type DefaultOptionsType = RootOptionsType & {
  element?: ElementType;
};

export type DefaultDataOptionsType = RootOptionsType & {
  import?: ImportObjectType;
  script?: ScriptType;
};

export type EachOptionsType = DefaultDataOptionsType & {
  functionName?: string;
  valueName?: string;
  element?: ElementType;
  componentData?: boolean;
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

export type ExportDataArrayType = Array<ExportDataType>;

export type IdType = number | undefined;

export type ScriptFunctionType = (...args: any[]) => void;

export type ScriptType =
  | [ScriptFunctionType, ScriptOptionsType]
  | ScriptFunctionType;

export type ExportDataType = {
  [key: string]: {
    [key: string]: any;
  };
};
export type DataFunctionArgumentsType = { data?: ExportDataType };

export type DataFunctionType = (
  argument?: DataFunctionArgumentsType
) => DataType;

export type ComponentOptionsType = DefaultDataOptionsType & {
  data?: DataType | DataFunctionType;
};

export type AnimationElementType = {
  selector: string;
  id?: string;
  class?: string;
  transition?: string;
  attributes?: AttributesType;
};

export type ExportIdType = string | number;

export type AnimationOptionsType = {
  event: string;
  reverseEvent?: string;
  attributes?: AttributesType;
  styleAnimation: string;
  style?: string;
  class: string;
  transition?: string;
  element?: AnimationElementType;
  replaceTag?: boolean;
  replaceTags?: boolean;
  trimHTML?: boolean;
  export?: ExportDataType;
  exportId?: ExportIdType;
};

export type FunctionsType = {
  [key: string]: any;
};
