"use strict";
import {
  ComponentDynamicNodeComponentType,
  ExportObjectDataType,
  ImportObjectType
} from "../../../types/types";

export const createComponentDynamicNodeComponentType = (
  dataId: number,
  exportObject: ExportObjectDataType | undefined,
  currentImport: ImportObjectType | undefined
): ComponentDynamicNodeComponentType => {
  const DynamicNodeComponentType: ComponentDynamicNodeComponentType = {
    id: dataId,
    dataFunctions: {},
    functions: {},
    nodes: [],
    exportData: undefined,
    import: currentImport,
    exportObject
  };
  return DynamicNodeComponentType;
};
