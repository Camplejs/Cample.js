"use strict";
import {
  EachDynamicNodeComponentType,
  DynamicNodeComponentNodeType,
  ElementsType,
  ImportObjectType,
  EachTemplateType
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
  const DynamicNodeComponentType = {
    id: dataId,
    import: currentImport,
    elements,
    nodePrevious,
    nodeNext,
    template,
    nodeParentNode: parentNode,
    parentNode
  };
  return DynamicNodeComponentType;
};
