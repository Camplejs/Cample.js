"use-strict";
import { ExportIdType } from "../../../types/types";

export const renderExportId = (
  el: Element | null,
  exportId: ExportIdType | undefined
) => {
  if (el) {
    if (el.hasAttribute("data-cample-import")) {
      let dataSet = el.getAttribute("data-cample-import");
      if (dataSet) {
        dataSet = dataSet.replace(/\s+/g, "");
        const obj = JSON.parse(dataSet);
        if (obj && obj.exportId) {
          return obj.exportId;
        } else {
          return exportId;
        }
      } else {
        return exportId;
      }
    } else {
      if (exportId) {
        return exportId;
      }
    }
  }
  return 0;
};
