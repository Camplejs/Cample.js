"use-strict";
import { createError } from "../../../shared/utils";
import { DataType, ExportDataType } from "../../../types/types";
export const renderImportData = (
  el: Element | null,
  exportData: ExportDataType | undefined,
  condition: boolean | undefined
): DataType => {
  const result = {};
  if (el) {
    if (el.hasAttribute("data-cample-import")) {
      let dataSet = el.getAttribute("data-cample-import");
      if (dataSet) {
        if (exportData) {
          dataSet = dataSet.replace(/\s+/g, "");
          const obj = JSON.parse(dataSet);
          if (obj.import) {
            if (!(obj.exportId !== "undefined")) {
              createError("ExportId included");
            }
            let dataSetArr = obj.import.split(";");
            dataSetArr = dataSetArr.map((e: string) => {
              return e.includes(":") ? e.split(":") : e;
            });
            dataSetArr.forEach((e: Array<string> | string) => {
              if (Array.isArray(e)) {
                if (e.length === 2) {
                  const testString = e[1].replace(/[0-9]/g, "");
                  if (!testString) {
                    if (exportData.hasOwnProperty(obj.exportId)) {
                      if (exportData[obj.exportId].hasOwnProperty(e[0])) {
                        const bindIndex = Number(e[1]);
                        result[e[0]] =
                          exportData[obj.exportId][e[0]][bindIndex];
                      } else {
                        createError(`Property value "${e[0]}" not found`);
                      }
                    } else {
                      createError(`ExportId not found`);
                    }
                  } else {
                    createError(`Bind index type is number`);
                  }
                } else {
                  createError(`Syntax value error`);
                }
              } else {
                if (exportData.hasOwnProperty(obj.exportId)) {
                  if (exportData[obj.exportId].hasOwnProperty(e)) {
                    result[e] = exportData[obj.exportId][e];
                  } else {
                    createError(`Property value "${e}" not found`);
                  }
                } else {
                  createError(`ExportId not found`);
                }
              }
            });
          } else {
            createError("Nothing to import");
          }
        } else {
          createError("Nothing to import");
        }
      }
      if (!condition) {
        el.removeAttribute("data-cample-import");
      }
    }
  }
  return result;
};
