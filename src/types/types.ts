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

export type IndexType = number;

export type ImportObjectType = {
  value: ImportType;
  exportId?: ExportIdType;
  isDynamic?: boolean;
  importIndex?: IndexType;
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
  index: IndexType;
  importIndex?: IndexType;
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
export type EachTemplateArgumentType = {
  [key: string]: any;
};
export type EachTemplateFunction = (
  argument?: EachTemplateArgumentType,
  index?: number
) => string;

export type EachDataValueType = EachDataObjectType | Array<any>;

export type EachDataFunctionType = (
  argument?: DataFunctionArgumentsType
) => EachDataValueType;

export type DataAttributesArrayType = Array<DataAttributeType>;

export type AttrValueType = {
  [key: string]: any;
};

export type AttributesValType = {
  [key: string]: {
    value: string | [string, boolean];
    keys: {
      [key: string]: CurrentKeyType;
    };
  };
};
export type AttributesValObjType = {
  id: IdType;
  attrs: AttributesValType;
};
export type DynamicEl = Element | undefined;
export type DynamicEls = Array<Element>;
export type DynamicElement = {
  el: DynamicEl;
  els: DynamicEls;
};

export type DynamicTextType = {
  key: CurrentKeyType;
  isProperty?: boolean;
  texts: Array<Text | number>;
};

export type DynamicTextArrayType = Array<DynamicTextType>;

export type TextArrayType = Array<Text>;

export type DynamicFunctionsType = {
  [key: string]: (attribute?: any) => void;
};

export type DataComponentType = DataType | DataFunctionType | undefined;

export type DynamicDataValueType = DataComponentType | EachDataValueType;

export type DynamicDataType = {
  value: DynamicDataValueType;
  oldValue?: DynamicDataValueType;
  importData?: ImportDataType;
  id: number;
};
export type ElementIndexType = {
  id: number;
  path: Array<number>;
};
export type FunctionEventType = (...args: any[]) => any;
export type FunctionsEventsType = Array<FunctionEventType>;
export type EventType = {
  id: IdType;
  events: FunctionsEventsType;
};

export type EventsType = Array<EventType>;

export type CampleImportType = {
  value: string;
};

export type ValueValueType =
  | FunctionEventType
  | AttributesValType
  | DynamicTextType
  | CampleImportType;

export type ValueType = {
  id?: IdType;
  type: "event" | "dynamicText" | "attribute" | "import";
  value: ValueValueType;
};
export type ValuesTemplateType = Array<ValueType>;
export type EachTemplateNodesType = Array<number>;
export type EachTemplateType = {
  el: Element | null;
  nodes: EachTemplateNodesType;
  values: ValuesTemplateType;
};
export type ElementsType = Element[];
export type DynamicNodeComponentNodeType = ChildNode | null | undefined;
export type DynamicNodeComponentParentNodeType = ParentNode | null | undefined;
export type EachDynamicNodeComponentType = {
  elements: ElementsType;
  import?: ImportObjectType;
  parentNode: ParentNode;
  template?: EachTemplateType;
  nodeNext: DynamicNodeComponentNodeType;
  nodePrevious: DynamicNodeComponentNodeType;
  nodeParentNode: DynamicNodeComponentParentNodeType;
  id: number;
};
export type ImportDataType = {
  [key: string]: any;
};
export type DataExportObjectDataType = {
  [key: string]: ExportTemplateDataType;
};
export type DataIndexesValueType = {
  [key: string]: Array<number | [number]>;
};

export type DataIndexesObjectType = {
  data: DataIndexesValueType;
  functions: DataIndexesValueType;
};

export type DataIndexesType = {
  [key: string]: DataIndexesObjectType;
};

export type ExportObjectDataType = {
  data: DataExportObjectDataType;
  indexesData: DataIndexesType;
  index: number;
  constructor: DataExportObjectDataType;
};

export type ExportObjectDataArrayType = Array<ExportObjectDataType>;

export type ComponentDynamicNodeComponentType = {
  id: number;
  functions: FunctionsType;
  exportData?: ExportDataType;
  exportObject?: ExportObjectDataType;
  import?: ImportObjectType;
};
export type ArrayAnyType = Array<any>;

export type DataExportObjectType = {
  [key: string]: ExportDataArrayType;
};

export type DynamicNodeComponentType =
  | EachDynamicNodeComponentType
  | ComponentDynamicNodeComponentType;

export type LastNodeType = Element | ChildNode | ParentNode;

export type ScriptElementsType = {
  [key: string]: Element | null;
};
export type ScriptArgumentsType = {
  elements: ScriptElementsType;
  functions: FunctionsType;
  data: DataType | undefined;
  import?: DataType;
};

export type DynamicType = {
  nodes: Array<NodeType>;
  data: {
    values: Array<DynamicDataType>;
    components: Array<DynamicNodeComponentType>;
    currentId: number;
  };
};
export type ValuesArguments = {
  [key: string]: any;
};
export type ValuesValueType = {
  [key: string]: {
    [key: string]: boolean;
  };
};
export type ValuesType = (args: ValuesArguments) => ValuesValueType;
export type ArgumentsArrayType = Array<any>;

export type EventGetDataType = (
  key: string,
  dataId: number,
  index: IndexType
) => any;

export type EventEachGetDataType = (
  key: string,
  dataId: number,
  eachIndex: IdType,
  index: number
) => any;

export type EventFunctionType = (...args: any[]) => any;

export type ListenerValueType = {
  value: EventKeyObjectType;
  fn?: EventFunctionType;
};

export type ListenersType = {
  [key: string]: ListenerValueType;
};
export type DynamicTextsObj = {
  id: IdType;
  dynamicTexts: DynamicTextArrayType;
};
export type DynamicTextsType = Array<DynamicTextsObj>;
export type DynamicAttributesType = Array<AttributesValObjType>;
export type CurrentKeyType = {
  originKey: string;
  key: string;
  properties?: Array<string>;
  isProperty?: boolean;
  isOrigin?: boolean;
  isValue?: boolean;
};
export type NodeTextType = {
  key: CurrentKeyType;
  value: string;
};

export type NodeValueType = {
  render: any;
  type: "dynamicText" | "attribute";
  value: AttributesValType | NodeTextType;
};
export type NodeValuesType = Array<NodeValueType>;
export type NodeType = {
  isNew?: boolean;
  index: number;
  values: NodeValuesType;
  dataId: number;
  eachIndex?: number;
};

export type ArrayNodeType = Array<NodeType>;

export type DynamicKeyObjectType = {
  key: string;
  properties: Array<string>;
};
export type DynamicKeyObjectArrayType = Array<DynamicKeyObjectType>;

export type EventKeyObjectType = {
  key: string;
  arguments: ArgumentsArrayType;
};

export type EventKeyObjectArrayType = Array<EventKeyObjectType>;

export type DynamicKeyType = string | DynamicKeyObjectType;

export type DynamicKeyArrayType = Array<DynamicKeyType>;

export type ArrayStringType = Array<string>;

export type ElementType = {
  selector: string;
  id?: string;
  class?: string;
  attributes?: AttributesType;
};

export type FunctionsArrayType = [
  (...args: any[]) => (...args: any[]) => any,
  string
];
export type FunctionsObjType = {
  [key: string]: string | FunctionsArrayType;
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

export type ComponentRenderType = "dynamic" | "static";

export type DefaultDataOptionsType = RootOptionsType & {
  import?: ImportObjectType;
  script?: ScriptType;
  values?: ValuesType;
  functions?: FunctionsObjType;
};
export type IndexValueDataType = {
  [key: string]: number;
};
export type IndexValuFunctionsType = {
  [key: string]: number;
};
export type IndexValuesType = {
  data: IndexValueDataType;
  functions: IndexValuFunctionsType;
};
export type ArrayExportTamplateStringType = Array<string | undefined>;

export type ExportTemplateDataType = {
  data: {
    [key: string]: ArrayExportTamplateStringType;
  };
  functions: {
    [key: string]: ExportTemplateFunctionArrayType;
  };
};

export type ImportObjectArrayType = {
  data: ArrayStringType;
  functions: ArrayStringType;
};

export type ExportTemplateDataNewType = {
  data: {
    [key: string]: ArrayExportTamplateStringType | string;
  };
  functions: {
    [key: string]: ExportTemplateFunctionArrayType;
  };
};

export type ExportTemplateFunctionArrayType = Array<
  ExportTemplateFunctionsValueType | undefined
>;

export type ExportTemplateFunctionType = (...args: any[]) => void;

export type ExportTemplateFunctionsValueType = [
  ExportTemplateFunctionType,
  string
];

export type ExportTemplateFunctionsType = {
  [key: string]: ExportTemplateFunctionsValueType;
};

export type ExportTemplateValueDataType = {
  [key: string]: string | ArrayStringType;
};
export type TemplateExportValueType = {
  data?: ExportTemplateValueDataType;
  functions?: ExportTemplateFunctionsType;
};

export type ExportDynamicType = {
  [key: string]: TemplateExportValueType;
};

export type IterationFunctionType = (...args: any[]) => void;

export type EachOptionsType = DefaultDataOptionsType & {
  functionName?: string;
  valueName?: string;
  importedDataName?: string;
  element?: ElementType;
  componentData?: boolean;
  iteration?: IterationFunctionType;
};

export type DataPropertyType = {
  value?: any;
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

export type ExportDataArrayType = Array<ExportDataType | undefined>;

export type IdType = number | undefined;

export type ScriptFunctionType = (...args: any[]) => void;
export type CycleValueType = { value: string; index: string };
export type ScriptType =
  | [ScriptFunctionType, ScriptOptionsType]
  | ScriptFunctionType;

export type ExportDataValuesValueType = {
  [key: string]: any;
};

export type ExportDataType = {
  [key: string]: ExportDataValuesValueType;
};

export type ExportDataValueType = {
  value: {
    [key: string]: any;
  };
  components: Array<any>;
};

export type ExportCampleDataType = {
  [key: string]: ExportDataValueType;
};
export type ComponentTemplateType = string | ComponentTemplateFunctionType;
export type ComponentTemplateArgumentType = {
  data: DataType | undefined;
};
export type ComponentTemplateFunctionType = (
  argument?: ComponentTemplateArgumentType
) => string;

export type ExportFunctionDataOptionsType = {
  data: DataType | undefined;
};

export type ExportFunctionDataType = (
  arg: ExportFunctionDataOptionsType
) => ExportDataType;

export type ExportDynamicDataType = ExportFunctionDataType | ExportDataType;

export type DataFunctionArgumentsType = {
  importedData?: ExportDataType;
  currentData?: DataType | EachDataValueType;
};

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
