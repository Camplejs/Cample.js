"use-strict";
import { getArrImportString } from "../../../shared/utils";
import { ImportObjectType } from "../../../types/types";

export const renderImport = (
  el: Element | null,
  importData: ImportObjectType | undefined
) => {
  if (el) {
    if (importData && importData.value) {
      const val = getArrImportString(importData);
      if (val) {
        el.setAttribute("data-cample-import", val);
      }
    }
  }
};
