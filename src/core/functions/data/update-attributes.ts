"use-strict";
import {
  AttributesValType,
  DynamicEl,
  CurrentKeyType,
  DynamicKeyObjectArrayType
} from "../../../types/types";

const setAttr = Element.prototype.setAttribute;
const regex = /\{{(.*?)}}/g;
export const updateAttributes = (
  el: DynamicEl,
  attr: AttributesValType,
  getValue?: (key: CurrentKeyType) => any,
  filtredKeys?: DynamicKeyObjectArrayType
) => {
  if (el && getValue) {
    if (Array.isArray(attr.value)) {
      const newVal: [string, boolean] = [...attr.value];
      const val = newVal[0].replace(regex, (str, d) => {
        const data = getValue({
          originKey: d,
          key: d,
          isValue: newVal[1] as boolean
        });
        return String(data);
      });
      if (attr.oldValue !== val) {
        attr.oldValue = val;
        setAttr.call(el, attr.name, val);
      }
    } else {
      const newVal = attr.value.replace(regex, (str, d) => {
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
        setAttr.call(el, attr.name, newVal);
      }
    }
  }
};
