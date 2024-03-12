"use strict";

import { DynamicKeyType, RenderedKeyType } from "../../../types/types";

export const renderKey = (key: string): RenderedKeyType => {
  if (key.includes(".")) {
    const attrKey = key.split(".");
    const length = attrKey.length - 1;
    const properties = new Array(length);
    for (let i = 0; i < length; i++) {
      properties[i] = attrKey[i + 1];
    }
    const dynamicKey: DynamicKeyType = {
      key: attrKey[0],
      properties
    };
    return dynamicKey;
  } else return key;
};
