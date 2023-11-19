"use-strict";

import { NodeType, NodeValuesType } from "../../../types/types";

export const createNode = (
  values: NodeValuesType,
  index: number,
  id: number,
  isFirst = false,
  key?: string,
  el?: Node
): NodeType => {
  const node: NodeType = {
    index,
    values,
    dataId: id
  };
  if (!isFirst) {
    node.isNew = true;
  }
  if (el) {
    node.el = el;
  }
  if (key !== undefined) {
    node.key = key;
  }
  return node;
};
