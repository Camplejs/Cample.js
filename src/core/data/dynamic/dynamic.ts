import { isValuesEqual } from "../../../shared/utils";
import { DataType, FunctionsType, UpdatingSetType } from "../../../types/types";

export class Dynamic {
  public functions: FunctionsType;
  public updatingSet: UpdatingSetType;

  constructor() {
    this.functions = new Set();
    this.updatingSet = new Map();
  }

  watcher(data: DataType, render: () => void): DataType | undefined {
    const functionUpdate = () => {
      render();
    };
    return Object.entries(data).reduce((object, [key, val]) => {
      Object.defineProperty(object, key, {
        get() {
          return val;
        },
        set(newValue) {
          if (!isValuesEqual(val, newValue)) {
            val = newValue;
            functionUpdate();
          }
        },
        enumerable: true
      });
      return object;
    }, {});
  }
}
