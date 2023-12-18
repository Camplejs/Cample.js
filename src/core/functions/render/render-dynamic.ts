"use-strict";

import { CurrentKeyType } from "../../../types/types";
import { renderValues } from "./render-values";

export const renderDynamic = (
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  if (key.isValue === true) {
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
