"use-strict";
import { SPACE_REGEX } from "../../../config/config";
import { createError } from "../../../shared/utils";
import {
  DataType,
  ExportDataType,
  ExportIdType,
  ImportArrayType,
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
  const renderData1 = (
    exportId: ExportIdType,
    currentIndex: IndexType | string,
    currentImport?: ImportType
  ) => {
    if (currentImport) {
      if (exportData) {
        // if (!(exportId !== "undefined" && exportId !== undefined)) {
        //   createError("ExportId included");
        // }
        // if (!(currentIndex !== "undefined" && currentIndex !== undefined)) {
        //   createError("Index included");
        // }
        if (exportData[exportId] !== undefined) {
          for (let e of currentImport) {
            if (Array.isArray(e)) {
              if (e.length === 2) {
                const key = e[0];
                const indexKey = e[1];
                const currentData = exportData[exportId][currentIndex];
                if (currentData) {
                  if (currentData.data[key] !== undefined) {
                    if (!result) result = {};
                    result[key] = currentData.data[key][indexKey];
                  } else if (currentData.functions[key] !== undefined) {
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
                if (!result) result = {};
                result[key] = value[0];
              };
              if (currentData) {
                if (currentData.data[e] !== undefined) {
                  setData(currentData.data, e);
                } else if (currentData.functions[e] !== undefined) {
                  setData(currentData.functions, e);
                } else {
                  createError(`Property value "${e}" not found`);
                }
              } else {
                createError(`Data error`);
              }
            }
          }
        } else {
          createError(`ExportId not found`);
        }
      }
    } else {
      createError("Nothing to import");
    }
  };
  const renderData2 = (
    exportId: ExportIdType,
    currentIndex: IndexType | string,
    currentImport?: ImportArrayType
  ) => {
    // if (!(exportId !== "undefined" && exportId !== undefined)) {
    //   createError("ExportId included");
    // }
    // if (!(currentIndex !== "undefined" && currentIndex !== undefined)) {
    //   createError("Index included");
    // }
    if ((exportData as any)[exportId] !== undefined) {
      for (let e of currentImport as any) {
        if (e.isArray !== undefined) {
          const val = e.value;
          const key = val[0];
          const indexKey = val[1];
          const currentData = (exportData as any)[exportId][currentIndex];
          if (currentData) {
            if (currentData.data[key] !== undefined) {
              if (result === undefined) result = {};
              result[key] = currentData.data[key][indexKey];
            } else if (currentData.functions[key] !== undefined) {
              if (result === undefined) result = {};
              result[key] = currentData.functions[key][indexKey];
            } else {
              createError(`Property value "${val[0]}" not found`);
            }
          } else {
            createError(`Data error`);
          }
        } else {
          e = e.value;
          const currentData = (exportData as any)[exportId][currentIndex];
          const setData = (data: object, key: string) => {
            const value = data[key];
            if (result === undefined) result = {};
            result[key] = value[0];
          };
          if (currentData) {
            if (currentData.data[e] !== undefined) {
              setData(currentData.data, e);
            } else if (currentData.functions[e] !== undefined) {
              setData(currentData.functions, e);
            } else {
              createError(`Property value "${e}" not found`);
            }
          } else {
            createError(`Data error`);
          }
        }
      }
    } else {
      createError(`ExportId not found`);
    }
  };
  if (el) {
    if (el.hasAttribute("data-cample-import")) {
      let dataSet = el.getAttribute("data-cample-import");
      if (dataSet) {
        if (exportData) {
          dataSet = dataSet.replace(SPACE_REGEX, "");
          const obj = JSON.parse(dataSet);
          const dataSetArr = obj.import.split(";").map((e: string) => {
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
              // if (!Array.isArray(dataValueArr)) createError("Syntax value error");
              return dataValueArr;
            } else return e;
          });
          renderData1(obj.exportId, obj.index ? obj.index : 0, dataSetArr);
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
      renderData2(importObject.exportId, importIndex, importObject.value);
    }
  }
  return result;
};
