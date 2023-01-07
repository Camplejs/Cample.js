import { isValuesEqual } from "../../../shared/utils";
import { DataType, FunctionsType, UpdatingSetType } from "../../../types/types";

export class Dynamic {
  public functions: FunctionsType;
  public updatingSet: UpdatingSetType;
  public oldNode: Node | null;
  public oldData: DataType | undefined;

  constructor() {
    this.functions = new Set();
    this.updatingSet = new Map();
    this.oldNode = null;
    this.oldData = undefined;
  }

  watcher(
    data: DataType,
    updateData: () => void,
    render: () => void
  ): DataType | undefined {
    const functionUpdate = () => {
      render();
    };
    const functionUpdateData = () => {
      updateData();
    };
    return Object.entries(data).reduce((object, [key, val]) => {
      Object.defineProperty(object, key, {
        get() {
          return val;
        },
        set(newValue) {
          if (!isValuesEqual(val, newValue)) {
            functionUpdateData();
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
