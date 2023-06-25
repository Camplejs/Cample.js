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
  attrs: AttributesValType,
  getValue?: (key: CurrentKeyType) => any,
  filtredKeys?: DynamicKeyObjectArrayType
) => {
  if (el && getValue) {
    Object.entries(attrs).forEach(([key, attr]) => {
      if (Array.isArray(attr.value)) {
        const newVal: [string, boolean] = [...attr.value];
        newVal[0] = newVal[0].replace(regex, (str, d) => {
          const data = getValue({
            originKey: d,
            key: d,
            isValue: newVal[1] as boolean
          });
          return String(data);
        });
        setAttr.call(el, key, newVal[0]);
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
        setAttr.call(el, key, newVal);
      }
    });
  }
};
