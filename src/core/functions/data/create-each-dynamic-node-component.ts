"use strict";
import {
  EachDynamicNodeComponentType,
  DynamicNodeComponentNodeType,
  ElementsType,
  ImportObjectType,
  EachTemplateType,
  ClearStackType
} from "../../../types/types";

export const createEachDynamicNodeComponentType = (
  dataId: number,
  elements: ElementsType,
  parentNode: ParentNode,
  nodePrevious?: DynamicNodeComponentNodeType,
  nodeNext?: DynamicNodeComponentNodeType,
  currentImport?: ImportObjectType,
  template?: EachTemplateType
): EachDynamicNodeComponentType => {
  const DynamicNodeComponentType: any = {
    id: dataId,
    import: currentImport,
    elements,
    nodePrevious,
    functions: {},
    dataFunctions: {},
    nodes: [],
    nodeNext,
    template,
    keys: [],
    parentNode,
    eachStackValues: [],
    stack: []
  };
  const clearStack: ClearStackType = () => {
    if (DynamicNodeComponentType.stack.length > 0) {
      const { template } = DynamicNodeComponentType;
      const { eachStackValues } = template;
      for (let i = 0; i < DynamicNodeComponentType.stack.length; i++) {
        const currentActiveStack = DynamicNodeComponentType.stack[i];
        const currentNode = DynamicNodeComponentType.nodes[currentActiveStack];
        // So far for the main element. The logic used for values ​​will be done later, but for the test only this test functionality is tried.
        const el = currentNode.el;
        const eachStack = currentNode.eachStack;
        const currentEachStackValue = eachStackValues[0];
        currentEachStackValue(el, eachStack, "");
      }
      DynamicNodeComponentType.stack = [];
    }
  };
  DynamicNodeComponentType.clearStack = clearStack;
  return DynamicNodeComponentType;
};
