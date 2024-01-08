"use strict";

import { cloneTemplate, createError } from "../../../shared/utils";
import {
  ExportDataType,
  ExportDynamicType,
  IndexValuesType,
  TemplateExportValueType
} from "../../../types/types";

export const renderComponentTemplate = (
  currentExport: ExportDataType | ExportDynamicType | undefined,
  exportFunctions: any,
  valueExport: string,
  index: number,
  componentName: string
) => {
  if (currentExport) {
    const {
      getExportObject,
      renderExportObject,
      createExportObject,
      renderIndexesValue,
      renderImportString
    } = exportFunctions;
    const template: TemplateExportValueType = cloneTemplate(
      currentExport[valueExport]
    );
    const currentExportObject = getExportObject(index);
    const indexesValue: IndexValuesType = {
      data: {},
      functions: {}
    };
    let importIndex: number | undefined = undefined;
    if (currentExportObject) {
      const newExportObject = renderExportObject(
        componentName,
        currentExportObject.data,
        template,
        indexesValue
      );
      const exportObject = getExportObject(index);
      exportObject!.data = newExportObject;
      importIndex = exportObject?.index;
    } else {
      createExportObject(index, componentName, template, indexesValue);
      importIndex = index;
    }
    if (currentExportObject) {
      const oldIndexesData = currentExportObject.indexesData;
      const indexesData = renderIndexesValue(
        oldIndexesData,
        componentName,
        indexesValue
      );
      currentExportObject.indexesData = indexesData;
    }
    const importObject = { ...template };

    const importString = renderImportString(
      importObject,
      index,
      indexesValue,
      importIndex
    );
    return importString;
  } else {
    createError("TemplateExport is required");
  }
};
