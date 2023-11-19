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
          isValue: newVal[1] as boolean,
          originType: 0
        });
        return String(data);
      });
      if (attr.oldValue !== val) {
        attr.oldValue = val;
        setAttribute.call(el, attr.name as string, val);
      }
    } else {
      const newVal = (attr.value as string).replace(MAIN_REGEX, (_, d) => {
        const renderedKey = (attr.keys as AttributesValType)[d];
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
        setAttribute.call(el, attr.name as string, newVal);
      }
    }
  }
};
