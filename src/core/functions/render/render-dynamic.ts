import { CurrentKeyType } from "../../../types/types";
import { renderKeyData } from "./render-key-data";
import { renderValues } from "./render-values";

export const renderDynamic = (
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  if (key.isValue) {
    return renderValues(key, data, importData, eachIndex);
  } else {
    switch (key.originType) {
      case 1:
        return renderKeyData(data, key.properties);
      case 2:
        return renderKeyData(importData, key.properties);
      case 3:
        return eachIndex;
      default:
        return undefined;
    }
  }
};
