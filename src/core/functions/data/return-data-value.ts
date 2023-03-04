"use-strict";
import { DataType } from "../../../types/types";

export const returnDataValue = (data: DataType | undefined, key: string) => {
  if (data) {
    return data[key];
  } else {
    return undefined;
  }
};
