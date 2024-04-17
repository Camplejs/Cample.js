"use strict";
import {
  ComponentDynamicNodeComponentType,
  DynamicDataType,
  ExportObjectDataType,
  ImportObjectType
} from "../../../types/types";

export const createComponentDynamicNodeComponentType = (
  dataId: number,
  exportObject: ExportObjectDataType | undefined,
  currentImport: ImportObjectType | undefined,
  value: DynamicDataType
): ComponentDynamicNodeComponentType => {
  const DynamicNodeComponentType: ComponentDynamicNodeComponentType = {
    id: dataId,
    dataFunctions: {},
    functions: {},
    nodes: [],
    exportData: undefined,
    import: currentImport,
    exportObject,
    value
  };
  return DynamicNodeComponentType;
};
