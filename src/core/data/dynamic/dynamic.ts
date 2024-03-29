"use-strict";
import { ArrayNodeType, DynamicType } from "../../../types/types";

export class Dynamic {
  public dynamicNodes: ArrayNodeType;
  public data: DynamicType;

  constructor() {
    this.dynamicNodes = [];
    this.data = {
      data: {
        values: [],
        components: [],
        currentId: 0
      }
    };
  }
}
