"use strict";

import { ArrayStringType } from "../../../types/types";

export const renderKeyData = (data: any, properties?: ArrayStringType) => {
  let newData = data;
  for (const property of properties || []) {
    newData = newData[property];
  }
  return newData;
};
