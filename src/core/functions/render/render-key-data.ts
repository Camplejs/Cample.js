"use strict";

import { ArrayStringType } from "../../../types/types";

export const renderKeyData = (data: any, properties: ArrayStringType) => {
  let newData = data;
  properties.forEach((property) => {
    newData = newData[property];
  });
  return newData;
};
