"use strict";

import { cloneNode, push } from "../../../config/config";
import {
  EachTemplateType,
  ExportDataType,
  ExportDynamicType,
  ImportDataType,
  IndexObjNode,
  NodeType,
  NodeValuesType,
  RenderNodeFunctionType
} from "../../../types/types";

export const createElement = (
  renderDynamic: (...args: any[]) => any,
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
    render: templateRender
  } = templateEl;
  const el = cloneNode.call(templateElemenet, true);
  const length = templateNodes.length;
  const nodes: Array<IndexObjNode | ChildNode | null> = [];
  push.call(nodes, el as ChildNode);
  const newValues: NodeValuesType = [];
  templateRender !== undefined
    ? templateRender.call(
        el as ChildNode,
        newValues,
        renderDynamic,
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
    push.call(
      nodes,
      (render as RenderNodeFunctionType).call(
        nodes[rootId],
        newValues,
        renderDynamic,
        indexData,
        eachIndex,
        importData,
        key,
        exportFunctions,
        currentExport
      )
    );
  }
  const currentNode: NodeType = {
    index,
    values: newValues,
    dataId,
    el,
    key
  };
  return { el: el as Element, currentNode };
};
