"use-strict";
import { DataType } from "../../../types/types";

export const returnDataValue = (
  data: DataType | undefined,
  key: string,
  isEach?: boolean,
  valueName?: string
) => {
  if (isEach && valueName !== undefined) {
    return valueName === key ? data : undefined;
  } else {
    if (data) {
      return data[key];
    } else {
      return undefined;
    }
  }
};
