"use-strict";
import { VALUE_REGEX } from "../../../config/config";
import { checkObject, createError, getIsValue } from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicKeyObjectType,
  KeyValuesType,
  RenderedKeyType,
  ValueItemType,
  ValueKeyStringType,
  ValuesType
} from "../../../types/types";
import { renderKey } from "../render/render-key";
import { renderKeyData } from "../render/render-key-data";
import { renderFn3 } from "../render/render-template-functions";
import { parseValues } from "./parse-values";

const validateIsValue = (
  renderedKey: RenderedKeyType,
  key: string
): [RenderedKeyType, boolean, boolean] => {
  const isObj = checkObject(renderedKey);
  const isValue = getIsValue(key);
  if (isObj) {
    if (isValue && (renderedKey as DynamicKeyObjectType).properties.length > 0)
      createError("Value error");
  } else {
    if (isValue) {
      renderedKey = (renderedKey as string).replace(VALUE_REGEX, (_, d) => d);
    }
  }
  return [renderedKey, isValue, isObj];
};

export const parseKey = (
  key: string,
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  values?: ValuesType,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
  indexName?: string,
  isClass?: boolean,
  isCondition?: boolean
): CurrentKeyType => {
  const currentKey = renderKey(key);
  const [renderedKey, isValue, isObj] = validateIsValue(currentKey, key);
  const originKey = (
    isObj ? (renderedKey as DynamicKeyObjectType).key : renderedKey
  ) as string;
  let val: KeyValuesType | undefined = undefined;
  if (isValue) {
    if (isCondition) createError("The presence of value in the condition");
    if (values) {
      const currentObj = values[originKey];
      val = parseValues(
        valueFunctions,
        currentObj,
        valueName,
        importedDataName,
        stackName,
        indexName
      );
    } else {
      createError("Values error");
    }
  }
  const properties: Array<string> | undefined = isObj
    ? (renderedKey as DynamicKeyObjectType).properties
    : undefined;
  let originType = 0;
  const isProperty = !!(properties && properties.length);
  switch (originKey) {
    case valueName:
      originType = 1;
      break;
    case importedDataName:
      originType = 2;
      break;
    case indexName:
      if (isProperty) createError("Error properties");
      originType = 3;
      break;
    case stackName:
      originType = 4;
      break;
  }
  const isValSingle = val?.length === 1;
  const keyObj: CurrentKeyType = {
    originKey,
    key: isValue ? (renderedKey as string) : key,
    originType
  };
  if (val) {
    const isValKey = val.some((e) => {
      return e.isValueImport;
    });
    keyObj.isValueImport = isValKey;
  }
  if (isValue) {
    keyObj.isValue = isValue;
  }
  if (isProperty) {
    keyObj.isProperty = isProperty;
  }
  if (isClass) {
    keyObj.isClass = isClass;
  }
  if (properties && properties.length) {
    keyObj.properties = properties;
    if (properties.length === 1) {
      const prop = properties[0];
      keyObj.render = (data: any) => data[prop];
    } else {
      keyObj.render = (data: any) => renderKeyData(data, properties);
    }
  } else {
    keyObj.render = valueFunctions[2];
  }
  if (isValue) {
    if (isValSingle) {
      const keyObjValuesValue = (val as KeyValuesType)[0];
      const singleValues:
        | ValueKeyStringType
        | [ValueKeyStringType, ValueKeyStringType] = keyObjValuesValue.values;
      const isArray = Array.isArray(singleValues);
      const getValueCondition = (currentVal: ValueKeyStringType): boolean => {
        const { valueClass } = currentVal;
        const { value } = valueClass;
        const isValueArray = Array.isArray(value);
        if (
          !isValueArray &&
          value.render === renderFn3 &&
          typeof value.value === "string" &&
          value.value.split(" ").length === 1
        ) {
          return true;
        } else return false;
      };
      if (
        isArray ||
        (!isArray && !getValueCondition(singleValues)) ||
        !isClass
      ) {
        keyObj.values = keyObjValuesValue;
        keyObj.render = valueFunctions[8];
        const setRender = (val: ValueKeyStringType) => {
          const { valueClass } = val;
          if (checkObject(valueClass.value)) {
            valueClass.render = valueFunctions[7];
          }
        };
        const currentValues = keyObjValuesValue.values;
        if (Array.isArray(currentValues)) {
          for (let i = 0; i < currentValues.length; i++) {
            const currentVal = currentValues[i];
            setRender(currentVal);
          }
        } else setRender(currentValues);
      } else {
        delete keyObj.isValue;
        const value = (singleValues.valueClass.value as ValueItemType)
          .value as string;
        keyObj.isValueSingle = true;
        const { condition } = keyObjValuesValue;
        keyObj.valueSingle = {
          condition,
          value
        };
      }
    } else {
      keyObj.values = val;
      keyObj.render = valueFunctions[9];
    }
  }
  return keyObj;
};
