"use strict";
import { EACH_INDEX_NAME } from "../../../config/config";
import {
  DynamicEachDataType,
  EachStackType,
  EachTemplateType,
  ExportDataType,
  ExportDynamicType,
  GetStackType,
  ImportDataType,
  NodeNodesType,
  NodeType,
  RenderNodeFunctionType,
  SetStackType,
  StackType
} from "../../../types/types";

export const createElement = (
  currentComponent: any,
  indexData: any,
  dataId: number,
  templateEl: EachTemplateType,
  eachValue?: DynamicEachDataType,
  eachIndex?: number,
  importData?: ImportDataType,
  key?: string,
  exportFunctions?: any,
  currentExport?: ExportDataType | ExportDynamicType
) => {
  const {
    nodes: templateNodes,
    el: templateElemenet,
    render: templateRender,
    values: newValues,
    renderImport,
    valuesLength: lengthValues
  } = templateEl;
  const el = (templateElemenet as Element).cloneNode(true);
  el[EACH_INDEX_NAME] = eachIndex;
  const length = templateNodes.length;
  const nodes: NodeNodesType = new Array(length + 1);
  const stack: StackType = new Array(lengthValues);
  const newNodes = new Array(lengthValues);
  nodes[0] = el as ChildNode;
  templateRender !== undefined
    ? templateRender.call(
        el as ChildNode,
        currentComponent,
        el,
        newNodes,
        stack,
        indexData,
        eachIndex,
        importData,
        key,
        exportFunctions,
        currentExport,
        eachValue
      )
    : null;
  const eachStack = {};
  const currentNode: NodeType = {
    values: newValues,
    ri: renderImport,
    dataId,
    nodes: newNodes,
    stack,
    el,
    key,
    eachStack
  };
  const getDefaultStack = () => {
    return currentNode.eachStack!;
  };
  const updateStack = (attr = getDefaultStack()) => {
    return attr;
  };
  const setStack: SetStackType = (attribute: any = updateStack) => {
    const newStack = attribute(getDefaultStack());
    if (currentComponent.stack.indexOf(eachIndex) === -1) {
      currentComponent.stack.push(eachIndex);
    }
    const { template } = currentComponent;
    const { eachStackValues } = template;
    currentNode.eachStack = newStack;
    // So far for the main element. The logic used for values ​​will be done later, but for the test only this test functionality is tried.
    const el = currentNode.el;
    const eachStack = currentNode.eachStack;
    for (let i = 0; i < eachStackValues.length; i++) {
      const currentEachStackValue = eachStackValues[i];
      currentEachStackValue(el, eachStack);
    }
  };
  const getStack: GetStackType = () => {
    const eachObj: EachStackType = {
      currentStack: getDefaultStack(),
      clearStack: currentComponent.clearStack,
      setStack
    };
    return eachObj;
  };
  for (let i = 0; i < length; i++) {
    const templateNode = templateNodes[i];
    const { render, rootId } = templateNode;
    nodes[i + 1] = (render as RenderNodeFunctionType).call(
      nodes[rootId],
      currentComponent,
      el,
      newNodes,
      stack,
      indexData,
      eachIndex,
      importData,
      key,
      exportFunctions,
      currentExport,
      eachValue,
      getStack
    );
  }
  return { el: el as Element, currentNode };
};
