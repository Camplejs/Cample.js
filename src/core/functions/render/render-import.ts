"use-strict";
import { SPACE_REGEX } from "../../../config/config";
import {
  concatArrays,
  createError,
  getArrImportString
} from "../../../shared/utils";
import { ImportObjectType } from "../../../types/types";

export const renderImport = (
  el: Element | null,
  importData?: ImportObjectType | undefined,
  importString?: string
) => {
  let importObject: ImportObjectType | undefined = undefined;
  if (el) {
    if (importData && importData.value) {
      const val = getArrImportString(importData, 0);
      if (val) {
        if (el.hasAttribute("data-cample-import")) {
          let oldImport = el.getAttribute("data-cample-import");
          if (oldImport) {
            oldImport = oldImport.replace(SPACE_REGEX, "");
            const oldData = JSON.parse(oldImport);
            if (oldData.import) {
              if (!(oldData.exportId !== "undefined")) {
                createError("ExportId included");
              }
              if (!(oldData.index !== "undefined")) {
                createError("Index included");
              }
              const importObjData = JSON.parse(oldData.import);
              const dataSetArr = importObjData.data
                ? importObjData.data.split(";")
                : [];
              const functionsSetArr = importObjData.functions
                ? importObjData.functions.split(";")
                : [];
              const dataArr = concatArrays(dataSetArr, functionsSetArr);
              if (oldData.exportId === importData.exportId) {
                const concatArrays = (
                  oldArr: Array<any>,
                  newArr: Array<any>
                ) => {
                  const result: Array<any> = [];
                  const secondArr = [...newArr];
                  oldArr.forEach((e) => {
                    if (e.includes("[") && Array.isArray(JSON.parse(e))) {
                      if (!e.includes("]")) createError("Syntax value error");
                      const keyArr = JSON.parse(e);
                      if (keyArr[0]) {
                        if (secondArr.indexOf(keyArr[0]) !== -1) {
                          secondArr.splice(secondArr.indexOf(keyArr[0]), 1);
                        }
                      }
                    } else {
                      if (secondArr.indexOf(e) !== -1) {
                        secondArr.splice(secondArr.indexOf(e), 1);
                      }
                    }
                    result.push(e);
                  });
                  secondArr.forEach((e) => {
                    result.push(e);
                  });
                  return result;
                };
                const newDataArray = concatArrays(dataArr, importData.value);
                const newImport: ImportObjectType = {
                  value: newDataArray,
                  exportId: oldData.exportId,
                  importIndex: oldData.importIndex
                };
                importObject = newImport;
                const newVal = getArrImportString(newImport, oldData.index);
                if (newVal) {
                  el.setAttribute("data-cample-import", newVal);
                }
              } else {
                createError("ExportId error");
              }
            }
          }
        } else {
          importObject = importData;
          el.setAttribute("data-cample-import", val);
        }
      }
    } else {
      if (importString !== undefined) {
        el.setAttribute("data-cample-import", importString);
      }
    }
  }
  return importObject;
};
