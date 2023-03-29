"use strict";
import {
  DynamicNodeComponentNodeType,
  DynamicNodeComponentType,
  ElementsType
} from "../../../types/types";

export const createDynamicNodeComponent = (
  dataId: number,
  elements: ElementsType,
  parentNode: ParentNode,
  nodePrevious?: DynamicNodeComponentNodeType,
  nodeNext?: DynamicNodeComponentNodeType
): DynamicNodeComponentType => {
  const DynamicNodeComponentType = {
    id: dataId,
    elements,
    nodePrevious,
    nodeNext,
    nodeParentNode: parentNode,
    parentNode
  };
  return DynamicNodeComponentType;
};
