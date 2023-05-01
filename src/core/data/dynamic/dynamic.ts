"use-strict";
import { ArrayNodeType, DynamicType } from "../../../types/types";

export class Dynamic {
  public dynamicNodes: ArrayNodeType;
  public data: DynamicType;

  constructor() {
    this.dynamicNodes = [];
    this.data = {
      nodes: [],
      data: {
        values: [],
        components: [],
        currentId: 0
      }
    };
  }
}
