"use strict";
import {
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
  index: number,
  dataId: number,
  templateEl: EachTemplateType,
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
    values: newValues
  } = templateEl;
  const el = (templateElemenet as Element).cloneNode(true);
  const length = templateNodes.length;
  const nodes: NodeNodesType = new Array(length + 1);
  const lengthValues = newValues.length;
  const stack: StackType = new Array(lengthValues);
  const newNodes = new Array(lengthValues);
  nodes[0] = el as ChildNode;
  templateRender !== undefined
    ? templateRender.call(
        el as ChildNode,
        currentComponent,
        newNodes,
        stack,
        indexData,
        eachIndex,
        importData,
        key,
        exportFunctions,
        currentExport
      )
    : null;
  for (let i = 0; i < length; i++) {
    const templateNode = templateNodes[i];
    const { render, rootId } = templateNode;
    nodes[i + 1] = (render as RenderNodeFunctionType).call(
      nodes[rootId],
      currentComponent,
      newNodes,
      stack,
      indexData,
      eachIndex,
      importData,
      key,
      exportFunctions,
      currentExport
    );
  }
  const currentNode: NodeType = {
    index,
    values: newValues,
    dataId,
    nodes: newNodes,
    stack,
    el,
    key
  };
  return { el: el as Element, currentNode };
};
