"use strict";
import {
  EachDynamicNodeComponentType,
  DynamicNodeComponentNodeType,
  ElementsType,
  ImportObjectType
} from "../../../types/types";

export const createEachDynamicNodeComponentType = (
  dataId: number,
  elements: ElementsType,
  parentNode: ParentNode,
  nodePrevious?: DynamicNodeComponentNodeType,
  nodeNext?: DynamicNodeComponentNodeType,
  currentImport?: ImportObjectType
): EachDynamicNodeComponentType => {
  const DynamicNodeComponentType = {
    id: dataId,
    import: currentImport,
    elements,
    nodePrevious,
    nodeNext,
    nodeParentNode: parentNode,
    parentNode
  };
  return DynamicNodeComponentType;
};
