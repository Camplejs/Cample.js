"use strict";

import { CurrentKeyType } from "../../../types/types";

export const renderValues = (
  str: { value: string },
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  const { values, render } = key;
  (render as (...args: any[]) => void)(
    str,
    values,
    data,
    importData,
    eachIndex
  );
};
