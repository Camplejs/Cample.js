"use-strict";
import { SPACE_REGEX } from "../../../config/config";
import { createError } from "../../../shared/utils";
import {
  CycleValueType,
  DataType,
  ExportDataType,
  ExportIdType,
  ImportObjectType,
  ImportType,
  IndexType
} from "../../../types/types";
export const renderImportData = (
  el: Element | null,
  exportData: ExportDataType | undefined,
  importObject?: ImportObjectType,
  importIndex?: IndexType
): DataType | undefined => {
  let result: undefined | DataType = undefined;
  const renderData = (
    exportId: ExportIdType,
    currentIndex: IndexType | string,
    currentImport?: ImportType | string
  ) => {
    if (currentImport) {
      if (exportData) {
        if (!(exportId !== "undefined" && exportId !== undefined)) {
          createError("ExportId included");
        }
        if (!(currentIndex !== "undefined" && currentIndex !== undefined)) {
          createError("Index included");
        }
        let dataSetArr = Array.isArray(currentImport)
          ? currentImport
          : currentImport.split(";");
        dataSetArr = dataSetArr.map((e: string) => {
          if (e.includes(":")) {
            const valueImportArr = e.split(":");
            if (valueImportArr.length === 2) {
              const objVal = {
                value: valueImportArr[0],
                index: valueImportArr[1]
              };
              return objVal;
            } else {
              createError(`Syntax value error`);
            }
          } else if (e.includes("[")) {
            if (!e.includes("]")) createError("Syntax value error");
            const dataValueArr = JSON.parse(e);
            if (!Array.isArray(dataValueArr)) createError("Syntax value error");
            return dataValueArr;
          } else return e;
        });
        dataSetArr.forEach((e: Array<string> | CycleValueType | string) => {
          if (exportData.hasOwnProperty(exportId)) {
            if (Array.isArray(e)) {
              if (e.length === 2) {
                const key = e[0];
                const indexKey = e[1];
                const currentData = exportData[exportId][currentIndex];
                if (currentData) {
                  if (currentData.data.hasOwnProperty(key)) {
                    if (!result) result = {};
                    result[key] = currentData.data[key][indexKey];
                  } else if (currentData.functions.hasOwnProperty(key)) {
                    if (!result) result = {};
                    result[key] = currentData.functions[key][indexKey];
                  } else {
                    createError(`Property value "${e[0]}" not found`);
                  }
                } else {
                  createError(`Data error`);
                }
              } else {
                createError(`Syntax value error`);
              }
            } else {
              e = e as string;
              const currentData = exportData[exportId][currentIndex];
              const setData = (data: object, key: string) => {
                const value = data[key];
                if (Array.isArray(value)) {
                  if (!result) result = {};
                  result[key] = value[0];
                } else {
                  createError(`Data error`);
                }
              };
              if (currentData) {
                if (currentData.data.hasOwnProperty(e)) {
                  setData(currentData.data, e);
                } else if (currentData.functions.hasOwnProperty(e)) {
                  setData(currentData.functions, e);
                } else {
                  createError(`Property value "${e}" not found`);
                }
              } else {
                createError(`Data error`);
              }
            }
          } else {
            createError(`ExportId not found`);
          }
        });
      }
    } else {
      createError("Nothing to import");
    }
  };
  if (el) {
    if (el.hasAttribute("data-cample-import")) {
      let dataSet = el.getAttribute("data-cample-import");
      if (dataSet) {
        if (exportData) {
          dataSet = dataSet.replace(SPACE_REGEX, "");
          const obj = JSON.parse(dataSet);
          renderData(obj.exportId, obj.index ? obj.index : 0, obj.import);
        } else {
          createError("Nothing to import");
        }
      }
    }
  } else {
    if (
      importObject &&
      exportData &&
      importObject.exportId &&
      importIndex !== undefined
    ) {
      renderData(importObject.exportId, importIndex, importObject.value);
    }
  }
  return result;
};
