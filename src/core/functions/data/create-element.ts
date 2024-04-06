"use strict";
import { EACH_INDEX_NAME } from "../../../config/config";
import {
  DynamicEachDataType,
  EachTemplateType,
  ExportDataType,
  ExportDynamicType,
  ImportDataType,
  NodeNodesType,
  NodeType,
  RenderNodeFunctionType,
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
      eachValue
    );
  }
  const currentNode: NodeType = {
    values: newValues,
    renderImport,
    dataId,
    nodes: newNodes,
    stack,
    el,
    key
  };
  return { el: el as Element, currentNode };
};
