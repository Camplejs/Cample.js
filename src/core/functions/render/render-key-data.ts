"use strict";

import { ArrayStringType } from "../../../types/types";

export const renderKeyData = (data: any, properties: ArrayStringType) => {
  let newData = data;
  if (properties.length > 0) {
    properties.forEach((property) => {
      newData = newData[property];
    });
  }
  return newData;
};
