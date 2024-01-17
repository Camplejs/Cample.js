"use strict";

import {
  cloneNode,
  mapArray,
  push,
  updClass,
  updText
} from "../../../config/config";
import { createError } from "../../../shared/utils";
import {
  AttributesValType,
  ClassType,
  CurrentKeyType,
  DynamicEl,
  EachTemplateType,
  ExportDataType,
  ExportDynamicType,
  FunctionEventType,
  ImportDataType,
  IndexObjNode,
  NodeTextType,
  NodeType,
  NodeValueType,
  NodeValuesType,
  RenderNodeFunctionType,
  TextArrayType,
  ValueItemsType,
  ValueType,
  ValuesTemplateType
} from "../../../types/types";
import { renderComponentTemplate } from "../render/render-component-template";
import { renderImport } from "../render/render-import";
import { updateAttributes } from "./update-attributes";
import { updateClass } from "./update-class";
import { updateText } from "./update-text";

export const createElement = (
  renderDynamic: (...args: any[]) => any,
  indexData: any,
  index: number,
  dataId: number,
  templateEl: EachTemplateType,
  eachIndex?: number,
  importData?: ImportDataType,
  key?: string,
  exportFunctions?: any,
  currentExport?: ExportDataType | ExportDynamicType
) => {
  const {
    nodes: templateNodes,
    values: templateValues,
    el: templateElemenet
  } = templateEl;
  const el = cloneNode.call(templateElemenet, true);
  const length = templateNodes.length;
  const nodes: Array<IndexObjNode | ChildNode | null> = [];
  push.call(nodes, el as ChildNode);
  for (let i = 0; i < length; i++) {
    const templateNode = templateNodes[i];
    const { render, rootId } = templateNode;
    push.call(nodes, (render as RenderNodeFunctionType).call(nodes[rootId]));
  }
  const values: ValuesTemplateType = mapArray.call(templateValues, (o) => {
    return {
      ...o
    } as ValueType;
  }) as ValuesTemplateType;
  const newValues: NodeValuesType = [];
  const valuesLength = values.length;
  for (let i = 0; i < valuesLength; i++) {
    const val = values[i];
    const valKey = val.key as CurrentKeyType;
    const node = nodes[val.id as number];
    switch (val.type) {
      case 0:
        const { render } = val;
        (render as FunctionEventType)(node, key);
        break;
      case 1:
        const newData = renderDynamic(valKey, indexData, importData, eachIndex);
        const texts = mapArray.call(val.texts, (e) => {
          const node = nodes[e as number] as Text;
          updText.call(node, newData);
          return node;
        }) as TextArrayType;
        const fnText = (
          currentIndexData: any,
          currentImportData: any,
          currentEachIndex: number | undefined,
          val: NodeTextType
        ) => {
          const newData = renderDynamic(
            valKey,
            currentIndexData,
            currentImportData,
            currentEachIndex
          );
          if (val.value !== newData) {
            updateText(newData, texts);
            val.value = newData;
          }
        };
        push.call(newValues, {
          render: fnText,
          type: 1,
          key: valKey,
          value: newData
        } as NodeValueType);
        break;
      case 2:
        const fnAttr = (
          currentIndexData: any,
          currentImportData: any,
          currentEachIndex: number | undefined
        ) => {
          const fnNew = (key: CurrentKeyType) =>
            renderDynamic(
              key,
              currentIndexData,
              currentImportData,
              currentEachIndex
            );
          updateAttributes(node as DynamicEl, val, fnNew);
        };
        fnAttr(indexData, importData, eachIndex);
        push.call(newValues, {
          render: fnAttr,
          ...(val as AttributesValType)
        } as NodeValueType);
        break;
      case 3:
        const componentName = (node as Element).getAttribute("data-cample");
        const keyImportString = val.value;
        if (keyImportString && componentName) {
          const newImportString = renderComponentTemplate(
            currentExport,
            exportFunctions,
            keyImportString,
            index,
            componentName
          );
          renderImport(node as Element, undefined, newImportString);
        } else {
          createError("Render export error");
        }
        break;
      default:
        const { classes } = val;
        const { value: classListValue, render: renderClass } =
          classes as ValueItemsType;
        const fnClass = (
          currentIndexData: any,
          currentImportData: any,
          currentEachIndex: number | undefined
        ) => {
          const classVal = renderClass(
            currentIndexData,
            classListValue,
            currentImportData,
            currentEachIndex
          );
          updateClass(node as Element, val, classVal);
        };
        const str = renderClass(
          indexData,
          classListValue,
          importData,
          eachIndex
        );
        if (str !== "") {
          updClass.call(node, str);
          val.old = str;
        }
        push.call(newValues, {
          render: fnClass,
          ...(val as ClassType)
        } as NodeValueType);
        break;
    }
  }
  const currentNode: NodeType = {
    index,
    values: newValues,
    dataId,
    el,
    key
  };
  return { el: el as Element, currentNode };
};
