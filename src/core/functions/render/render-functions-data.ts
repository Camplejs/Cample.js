import { DataType } from "../../../types/types";

export const renderFunctionsData = (
  data: DataType | undefined,
  updateFunction: (name: string, key: string) => void
): void => {
  if (data !== undefined) {
    for (const key in data) {
      if (
        (data[key].value !== undefined ||
          data[key].defaultValue !== undefined) &&
        data[key].function &&
        typeof data[key].function === "string"
      ) {
        updateFunction(data[key].function, key);
      }
    }
  }
};
