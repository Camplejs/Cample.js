"use-strict";

import { CurrentKeyType } from "../../../types/types";
import { renderKeyData } from "./render-key-data";
import { renderValues } from "./render-values";
export const renderDynamic1 = (key: CurrentKeyType, data: any) => {
  if (!key.isValue) {
    const firstKeyData = data[key.originKey];
    return key.isProperty
      ? renderKeyData(firstKeyData, key.properties as Array<string>)
      : firstKeyData;
  } else {
    const str = {
      value: ""
    };
    renderValues(str, key, data, undefined, undefined);
    return str.value;
  }
};
export const renderDynamic2 = (
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  if (key.isValue) {
    const str = {
      value: ""
    };
    renderValues(str, key, data, importData, eachIndex);
    return str.value;
  } else {
    switch (key.originType) {
      case 1:
        return (key.render as any)(data);
      case 2:
        return (key.render as any)(importData);
      case 3:
        return eachIndex;
      default:
        return undefined;
    }
  }
};
