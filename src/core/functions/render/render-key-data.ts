"use strict";

import { ArrayStringType } from "../../../types/types";

export const renderKeyData = (data: any, properties: ArrayStringType = []) => {
  let newData = data;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    newData = newData[property];
  }
  return newData;
};
