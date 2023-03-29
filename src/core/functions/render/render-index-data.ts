"use strict";

import { checkObject, createError } from "../../../shared/utils";

export const renderIndexData = (
  indexData: any,
  index: number | undefined
): any => {
  if (indexData) {
    if (Array.isArray(indexData)) {
      if (index !== undefined) {
        return indexData[index];
      } else {
        createError("Value error");
      }
    } else if (checkObject(indexData)) {
      if (Object.values(indexData).length) {
        if (index !== undefined) {
          return Object.values(indexData)[index];
        } else {
          createError("Value error");
        }
      } else return undefined;
    } else {
      createError("Each data is object or array");
    }
  } else return indexData;
};
