"use strict";
export const createArgumentsTemplateFunction = (
  data: any,
  importedData: any,
  dataName: string,
  importedDataName: string
) => {
  return {
    [dataName]: data,
    [importedDataName]: importedData
  };
};
