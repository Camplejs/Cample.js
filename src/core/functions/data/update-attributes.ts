"use-strict";
import { MAIN_REGEX, setAttribute } from "../../../config/config";
import {
  AttributesValType,
  DynamicEl,
  CurrentKeyType,
  DynamicKeyObjectArrayType
} from "../../../types/types";

export const updateAttributes = (
  el: DynamicEl,
  attr: AttributesValType,
  getValue?: (key: CurrentKeyType) => any,
  filtredKeys?: DynamicKeyObjectArrayType
) => {
  if (el && getValue) {
    if (Array.isArray(attr.value)) {
      const newVal: [string, boolean] = [...attr.value];
      const val = newVal[0].replace(MAIN_REGEX, (_, d) => {
        const data = getValue({
          originKey: d,
          key: d,
          type: (newVal[1] as boolean) ? 1 : 0,
          originType: 0
        });
        return String(data);
      });
      if (attr.oldValue !== val) {
        attr.oldValue = val;
        setAttribute.call(el, attr.name, val);
      }
    } else {
      const newVal = attr.value.replace(MAIN_REGEX, (_, d) => {
        const renderedKey = attr.keys[d];
        const data = getValue(renderedKey);
        if (filtredKeys)
          filtredKeys.push({
            key: renderedKey.originKey,
            properties: renderedKey.properties ?? []
          });
        return String(data);
      });
      if (attr.oldValue !== newVal) {
        attr.oldValue = newVal;
        setAttribute.call(el, attr.name, newVal);
      }
    }
  }
};
