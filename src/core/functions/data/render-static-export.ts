"use strict";
import { ExportDataType } from "../../../types/types";

export const renderStaticExport = (
  staticExport: ExportDataType | undefined
) => {
  if (staticExport) {
    const newStaticExportObject: ExportDataType = {};
    Object.entries(staticExport).forEach(([key, value]) => {
      const data = {};
      Object.entries(value).forEach(([newKey, newValue]) => {
        data[newKey] = [newValue];
      });
      const newValue = {
        data,
        functions: {}
      };
      newStaticExportObject[key] = [newValue];
    });
    return newStaticExportObject;
  } else return undefined;
};
