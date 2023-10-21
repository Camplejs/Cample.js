"use strict";

import { createError } from "../../../shared/utils";
import { DynamicKeyType, RenderedKeyType } from "../../../types/types";

export const renderKey = (key: string): RenderedKeyType => {
  if (key.includes(".")) {
    const attrKey = key.split(".");
    if (attrKey.length > 1) {
      const properties = attrKey.filter((_, i: number) => {
        return i !== 0;
      });
      const dynamicKey: DynamicKeyType = {
        key: attrKey[0],
        properties
      };
      return dynamicKey;
    } else {
      createError("Key error");
    }
  } else return key;
};
