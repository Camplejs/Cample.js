"use strict";

import { createError } from "../../../shared/utils";

export const renderIndexData = (
  indexData: any,
  index: number | undefined
): any => {
  if (indexData) {
    return index !== undefined ? indexData[index] : createError("Value error");
  } else return indexData;
};
